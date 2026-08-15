import { useEffect, useState } from "react";
import { Box, Typography, Grid, Skeleton, Fade } from "@mui/material";
import { supabase } from "../services/supabase";

export default function NewspaperTemplate() {
  const [featured, setFeatured] = useState<any>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState<any>(true);

  // Imagine de rezervă în caz că un articol nu are poză
  const PLACEHOLDER_IMAGE = "https://unsplash.com";

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const { data: settingsData } = await supabase
        .from("newspaper_settings")
        .select("*")
        .limit(1)
        .single();

      const { data: featuredData } = await supabase
        .from("newspaper_articles")
        .select("*")
        .eq("is_featured", true)
        .limit(1)
        .single();

      const { data: articlesData } = await supabase
        .from("newspaper_articles")
        .select("*")
        .eq("is_featured", false)
        .order("sort_order", { ascending: true });

      setSettings(settingsData);
      setFeatured(featuredData);
      setArticles(articlesData || []);
    } catch (error) {
      console.error("Eroare la încărcarea datelor:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        background: "#f0ede5",
        minHeight: "100vh",
        p: { xs: 2, md: 4 },
      }}
    >
      <Box
        sx={{
          maxWidth: "1100px",
          margin: "0 auto",
          backgroundColor: "#faf8f2",
          p: { xs: 3, md: 5 },
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          border: "1px solid #e6e1d5",
        }}
      >
        {/* HEADER ZIAR */}
        <Box sx={{ borderBottom: "4px double #000", pb: 1, mb: 4 }}>
          <Typography
            sx={{
              textAlign: "center",
              fontSize: { xs: 38, sm: 56 },
              fontWeight: 900,
              fontFamily: "'Playfair Display', Georgia, serif",
              letterSpacing: "-0.5px",
              mb: 1,
            }}
          >
            {loading ? (
              <Skeleton width="60%" sx={{ mx: "auto" }} />
            ) : (
              settings?.newspaper_name || "ZIARUL LOCAL OARJA"
            )}
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              borderTop: "1px solid #000",
              pt: 1,
              px: 1,
            }}
          >
            <Typography
              sx={{
                fontFamily: "Georgia, serif",
                fontSize: 12,
                fontStyle: "italic",
                color: "#444",
              }}
            >
              Fondat în 2026
            </Typography>
            <Typography
              sx={{
                fontFamily: "Georgia, serif",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              Ediția August 2026
            </Typography>
            <Typography
              sx={{
                fontFamily: "Georgia, serif",
                fontSize: 12,
                fontStyle: "italic",
                color: "#444",
              }}
            >
              Preț: Gratuit
            </Typography>
          </Box>
        </Box>

        {loading ? (
          <Box>
            <Skeleton variant="text" height={60} width="80%" sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={400} sx={{ mb: 3 }} />
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Skeleton variant="rectangular" height={250} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Skeleton variant="rectangular" height={250} />
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Fade in={!loading} timeout={800}>
            <Box>
              {/* ARTICOLUL PRINCIPAL (FEATURED) */}
              {featured && (
                <Box sx={{ mb: 6 }}>
                  <Typography
                    sx={{
                      fontSize: { xs: 28, sm: 42 },
                      fontWeight: 800,
                      fontFamily: "'Playfair Display', Georgia, serif",
                      lineHeight: 1.2,
                      mb: 1,
                    }}
                  >
                    {featured.title}
                  </Typography>

                  {/* Detaliu profi: Autor/Dată sub titlu */}
                  <Typography
                    sx={{
                      fontSize: 13,
                      color: "#666",
                      fontStyle: "italic",
                      fontFamily: "Georgia, serif",
                      mb: 2,
                    }}
                  >
                    Publicat la{" "}
                    {new Date(
                      featured.created_at || Date.now(),
                    ).toLocaleDateString("ro-RO")}{" "}
                    • de Redacție
                  </Typography>

                  {/* IMAGINE PRINCIPALĂ (Dacă lipsește în DB, pune placeholder) */}
                  <Box sx={{ mb: 3, overflow: "hidden" }}>
                    <Box
                      component="img"
                      src={featured.image_url || PLACEHOLDER_IMAGE}
                      alt={featured.title}
                      onClick={() =>
                        window.open(
                          featured.image_url || PLACEHOLDER_IMAGE,
                          "_blank",
                        )
                      }
                      sx={{
                        width: "100%",
                        maxHeight: "500px",
                        objectFit: "cover",
                        filter: "grayscale(15%) contrast(105%)",
                        cursor: "pointer",
                        transition: "all 0.5s ease",
                        "&:hover": {
                          filter: "grayscale(0%) contrast(100%)",
                          transform: "scale(1.01)",
                        },
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: 11,
                        color: "#777",
                        fontStyle: "italic",
                        mt: 0.5,
                        borderLeft: "2px solid #ccc",
                        pl: 1,
                      }}
                    >
                      Foto: Arhiva Oficială / Faceți click pe imagine pentru
                      mărire
                    </Typography>
                  </Box>

                  {/* Stil Drop-Cap (prima literă mare) adăugat prin CSS direct pe text */}
                  <Typography
                    sx={{
                      columnCount: { xs: 1, md: 2 },
                      columnGap: "40px",
                      textAlign: "justify",
                      fontSize: 16,
                      fontFamily: "Georgia, serif",
                      lineHeight: 1.8,
                      color: "#111",
                      "&::first-letter": {
                        float: "left",
                        fontSize: "52px",
                        lineHeight: "42px",
                        fontWeight: "900",
                        paddingRight: "8px",
                        paddingTop: "4px",
                        fontFamily: "'Playfair Display', Georgia, serif",
                      },
                    }}
                  >
                    {featured.content}
                  </Typography>
                </Box>
              )}

              {/* GRID-UL CU ARTICOLE SECUNDARE */}
              <Grid container spacing={5}>
                {articles.map((article) => (
                  <Grid key={article.id} size={{ xs: 12, sm: 6 }}>
                    <Box
                      sx={{
                        borderTop: "2px solid #000",
                        pt: 2,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between", // Împinge textul uniform jos
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{
                            fontSize: 22,
                            fontWeight: 700,
                            fontFamily: "'Playfair Display', Georgia, serif",
                            lineHeight: 1.3,
                            mb: 1.5,
                          }}
                        >
                          {article.title}
                        </Typography>

                        {/* IMAGINE ARTICOL SECUNDAR (Dacă lipsește în DB, pune placeholder) */}
                        <Box sx={{ mb: 2, overflow: "hidden" }}>
                          <Box
                            component="img"
                            src={article.image_url || PLACEHOLDER_IMAGE}
                            alt={article.title}
                            onClick={() =>
                              window.open(
                                article.image_url || PLACEHOLDER_IMAGE,
                                "_blank",
                              )
                            }
                            sx={{
                              width: "100%",
                              height: "220px", // Înălțime fixă obligatorie pentru aliniere perfectă
                              objectFit: "cover",
                              filter: "grayscale(20%)",
                              cursor: "pointer",
                              transition: "all 0.4s ease",
                              "&:hover": {
                                filter: "grayscale(0%)",
                                transform: "scale(1.02)",
                              },
                            }}
                          />
                        </Box>

                        <Typography
                          sx={{
                            textAlign: "justify",
                            fontFamily: "Georgia, serif",
                            lineHeight: 1.6,
                            fontSize: 14.5,
                            color: "#333",
                          }}
                        >
                          {article.content || article.summary}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Fade>
        )}
      </Box>
    </Box>
  );
}
