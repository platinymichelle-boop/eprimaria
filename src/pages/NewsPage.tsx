import { useState, useEffect, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { supabase } from "../services/supabase";
import {
  NewspaperPage,
  type NewsPageData,
  type NewsElement,
} from "./NewspaperPage";

export default function NewsPage() {
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState<NewsPageData[]>([]);
  const [elementsByPage, setElementsByPage] = useState<
    Record<string, NewsElement[]>
  >({});
  const [editionTitle, setEditionTitle] = useState("Ediție Curentă");
  const [currentPage, setCurrentPage] = useState(0);

  const flipBookRef = useRef<any>(null);

  // Injectare stiluri speciale pentru textul de ziar
  useEffect(() => {
    const styleId = "newspaper-flip-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = `
        /* IMPORT CORECT PENTRU FONTA EDITORIALĂ */
        @import url('https://googleapis.com');

        /* ASCUNDE BARA DE SCROLL DAR PĂSTREAZĂ SCROLL-UL FUNCȚIONAL */
        .newspaper-content-scroll::-webkit-scrollbar {
          display: none;
        }
        .newspaper-content-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .newspaper-dropcap::first-letter {
          float: left;
          font-size: 3.5em;
          line-height: 0.85;
          padding-right: 8px;
          margin-top: 4px;
          font-weight: 700;
          font-family: 'Playfair Display', serif;
          color: #000;
        }

        .magazine-flipbook {
          background-color: #f5f5f0;
        }

        .newspaper-page img {
          transition: all .25s ease;
        }

        .newspaper-page img:hover {
          transform: scale(1.01);
        }

        .newspaper-box {
          border: 1px solid #111;
          padding: 4px;
          background: #fff;
        }

        /* REZOLVARE BUG DE AFIȘARE ÎN react-pageflip (PAGINILE TREBUIE SĂ FIE BLOCK) */
        .page-wrapper {
          display: block !important;
          width: 100%;
          height: 100%;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Preluare date din Supabase
  useEffect(() => {
    const fetchLatestEditionData = async () => {
      try {
        setLoading(true);

        const { data: edition, error: edError } = await supabase
          .from("news_editions")
          .select("id, title")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (edError) throw edError;
        if (!edition) {
          setLoading(false);
          return;
        }

        setEditionTitle(edition.title);

        const { data: fetchedPages, error: pageError } = await supabase
          .from("news_pages")
          .select("*")
          .eq("edition_id", edition.id)
          .order("page_number", { ascending: true });

        if (pageError) throw pageError;
        setPages(fetchedPages || []);

        if (fetchedPages && fetchedPages.length > 0) {
          const pageIds = fetchedPages.map((p) => p.id);

          const { data: fetchedElements, error: elError } = await supabase
            .from("news_elements")
            .select("*")
            .in("page_id", pageIds);

          if (elError) throw elError;

          const mappedElements: Record<string, NewsElement[]> = {};
          fetchedElements?.forEach((el) => {
            if (!mappedElements[el.page_id]) {
              mappedElements[el.page_id] = [];
            }
            mappedElements[el.page_id].push(el);
          });

          setElementsByPage(mappedElements);
        }
      } catch (err: any) {
        console.error("Eroare la încărcarea ziarului:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestEditionData();
  }, []);

  // Event handler pentru a prinde momentul când utilizatorul întoarce pagina manual
  const onPageFlip = (e: any) => {
    setCurrentPage(e.data);
  };

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "radial-gradient(circle,#f8fafc,#e2e8f0)",
        }}
      >
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #eedcc5 0%, #dfcaaf 100%)", // Gradient discret, texturat pentru ziar
        overflow: "hidden",
        p: 2,
      }}
    >
      <Typography
        variant="h3"
        sx={{
          color: "#111",
          fontWeight: 800,
          mb: 1,
          fontSize: { xs: "28px", sm: "40px" },
          fontFamily: "'Playfair Display', serif",
          textTransform: "uppercase",
          letterSpacing: "2px",
          borderBottom: "4px double #111",
          px: 4,
          pb: 1,
          textAlign: "center",
        }}
      >
        {editionTitle}
      </Typography>

      {/* AFIȘARE NUMĂR PAGINĂ CURENTĂ (Foarte Profi) */}
      {pages.length > 0 && (
        <Typography
          sx={{
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            mb: 3,
            fontSize: "14px",
            color: "#444",
          }}
        >
          Pagina {currentPage + 1} din {pages.length}
        </Typography>
      )}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 1, sm: 3 },
          width: "100%",
          justifyContent: "center",
        }}
      >
        {/* Buton Înapoi dezactivat inteligent dacă ești la prima pagină */}
        <Button
          variant="contained"
          disabled={currentPage === 0}
          sx={{
            background: "#111",
            color: "#fff",
            "&:hover": { background: "#333" },
            "&.Mui-disabled": {
              background: "rgba(0,0,0,0.1)",
              color: "rgba(0,0,0,0.3)",
            },
            borderRadius: "50%",
            minWidth: { xs: 45, sm: 55 },
            height: { xs: 45, sm: 55 },
            boxShadow: 3,
            fontSize: "18px",
          }}
          onClick={() => flipBookRef.current?.pageFlip()?.flipPrev()}
        >
          ◀
        </Button>

        <Box
          sx={{
            backgroundColor: "#1c1a17", // Fundal tip „copertă masivă” din piele neagră/lemn sub ziar
            padding: { xs: "6px", sm: "16px" },
            borderRadius: "8px",
            boxShadow:
              "0 30px 70px rgba(0,0,0,0.45), inset 0 0 20px rgba(255,255,255,0.05)",
          }}
        >
          {/* @ts-ignore */}
          <HTMLFlipBook
            ref={flipBookRef}
            width={700}
            height={900}
            minWidth={320} // Permite redimensionarea pe ecrane mici (Responsivitate)
            maxWidth={700}
            minHeight={450}
            maxHeight={900}
            size="stretch" // Schimbat din "fixed" în "stretch" ca să poată scădea pe laptopuri mai mici
            maxShadowOpacity={0.5}
            showCover={false}
            mobileScrollSupport={true}
            className="magazine-flipbook"
            startPage={0}
            drawShadow={true}
            flippingTime={700} // Timp optimizat pentru un efect vizual fluid
            usePortrait={true}
            startZIndex={0}
            autoSize={true} // Schimbat în true pentru un comportament auto-scalabil fluid
            clickEventForward={true}
            useMouseEvents={true}
            swipeDistance={30}
            showPageCorners={true}
            disableFlipByClick={false}
            onFlip={onPageFlip} // Trimite numărul paginii în starea React la întoarcere
            style={{ boxShadow: "0 0 20px rgba(0,0,0,0.2)" }}
          >
            {pages.length === 0 ? (
              <div
                style={{
                  background: "#fbfbf8",
                  padding: "40px",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: "#64748b",
                    fontStyle: "italic",
                    fontFamily: "Georgia, serif",
                  }}
                >
                  Nu există pagini disponibile.
                </Typography>
              </div>
            ) : (
              pages.map((page) => (
                <div key={page.id} className="page-wrapper">
                  <NewspaperPage
                    page={page}
                    elements={elementsByPage[page.id] || []}
                  />
                </div>
              ))
            )}
          </HTMLFlipBook>
        </Box>

        {/* Buton Înainte dezactivat inteligent dacă ești la ultima pagină */}
        <Button
          variant="contained"
          disabled={currentPage === pages.length - 1 || pages.length === 0}
          sx={{
            background: "#111",
            color: "#fff",
            "&:hover": { background: "#333" },
            "&.Mui-disabled": {
              background: "rgba(0,0,0,0.1)",
              color: "rgba(0,0,0,0.3)",
            },
            borderRadius: "50%",
            minWidth: { xs: 45, sm: 55 },
            height: { xs: 45, sm: 55 },
            boxShadow: 3,
            fontSize: "18px",
          }}
          onClick={() => flipBookRef.current?.pageFlip()?.flipNext()}
        >
          ▶
        </Button>
      </Box>
    </Box>
  );
}
