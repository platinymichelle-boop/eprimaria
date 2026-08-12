import HTMLFlipBook from "react-pageflip";
import { Box } from "@mui/material";

export default function NewsPage() {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "radial-gradient(circle,#f8fafc,#dbeafe)",
        overflow: "hidden",
      }}
    >
      <HTMLFlipBook
        width={700}
        minWidth={700}
        maxWidth={700}
        minHeight={900}
        maxHeight={900}
        height={900}
        size="fixed"
        maxShadowOpacity={0.7}
        showCover={true}
        mobileScrollSupport={true}
        className=""
        style={{}}
        startPage={0}
        drawShadow={true}
        flippingTime={800}
        usePortrait={true}
        startZIndex={0}
        autoSize={false}
        clickEventForward={true}
        useMouseEvents={true}
        swipeDistance={30}
        showPageCorners={true}
        disableFlipByClick={false}
      >
        {/* PAGINA 1 */}

                <div
          style={{
            backgroundImage:
              "url('/images/oarja/Primaria.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: "white",
            padding: "40px",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden",
          }}
        >


          <div
            style={{
              position: "relative",
              zIndex: 2,
            }}
          >
            <h1
              style={{
                fontSize: "48px",
                margin: 0,
              }}
            >
              ZIARUL
            </h1>

            <h1
              style={{
                fontSize: "48px",
                margin: 0,
              }}
            >
              COMUNEI OARJA
            </h1>
          </div>

          <div
            style={{
              position: "relative",
              zIndex: 2,
            }}
          >
            <h2>August 2026</h2>

            <p>
              Comunitate • Dezvoltare • Viitor
            </p>
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 15,
              right: 20,
              fontSize: 14,
              fontWeight: "bold",
              opacity: 0.8,
              zIndex: 2,
            }}
          >
            1
          </div>
        </div>
                {/* PAGINA 2 */}

        <div
          style={{
            background: "#fff",
            padding: "35px",
            height: "100%",
            position: "relative",
          }}
        >
          <h1
            style={{
              color: "#0f3b75",
              borderBottom:
                "4px solid #c8102e",
              paddingBottom: "10px",
            }}
          >
            Mesaj către cetățeni
          </h1>

          <p
            style={{
              lineHeight: 1.9,
              fontSize: "17px",
            }}
          >
            Ne dorim o comună modernă,
            curată și unită, unde fiecare
            cetățean să se simtă respectat
            și ascultat.
          </p>

          <p
            style={{
              lineHeight: 1.9,
              fontSize: "17px",
            }}
          >
            Continuăm investițiile în
            infrastructură, educație,
            servicii publice și dezvoltarea
            locală pentru toți locuitorii
            comunei Oarja.
          </p>

          <div
            style={{
              position: "absolute",
              bottom: 15,
              left: 20,
              fontSize: 14,
              color: "#64748b",
              fontWeight: "bold",
            }}
          >
            2
          </div>
        </div>

        {/* PAGINA 3 */}

        <div
          style={{
            background: "#faf8f5",
            padding: "35px",
            height: "100%",
            position: "relative",
          }}
        >
          <h1
            style={{
              color: "#0f3b75",
            }}
          >
            Istoria Comunei Oarja
          </h1>

          <p
            style={{
              columnCount: 2,
              lineHeight: 1.8,
              fontSize: "15px",
            }}
          >
            Oarja este o comună din
            județul Argeș, situată în
            centrul județului.

            Comuna este formată din
            satele Oarja și Ceaușești și
            are o poziție importantă în
            zona de sud a județului.

            De-a lungul timpului
            localitatea s-a dezvoltat prin
            agricultură, activități
            comerciale și investiții
            locale.

            Astăzi comuna continuă să
            investească în infrastructură,
            educație și servicii publice
            moderne.
          </p>

          <div
            style={{
              position: "absolute",
              bottom: 15,
              right: 20,
              fontSize: 14,
              color: "#64748b",
              fontWeight: "bold",
            }}
          >
            3
          </div>
        </div>
                {/* PAGINA 4 */}

        <div
          style={{
            background: "white",
            padding: "25px",
            height: "100%",
            position: "relative",
          }}
        >
          <h1
            style={{
              color: "#0f3b75",
              marginTop: 0,
            }}
          >
            Viața Comunității
          </h1>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: "10px",
            }}
          >
            <div
              style={{
                height: "180px",
                background: "#dbeafe",
                borderRadius: "8px",
              }}
            />

            <div
              style={{
                height: "180px",
                background: "#bfdbfe",
                borderRadius: "8px",
              }}
            />

            <div
              style={{
                height: "180px",
                background: "#93c5fd",
                borderRadius: "8px",
              }}
            />

            <div
              style={{
                height: "180px",
                background: "#60a5fa",
                borderRadius: "8px",
              }}
            />
          </div>

          <p
            style={{
              marginTop: "20px",
              lineHeight: 1.8,
            }}
          >
            Evenimentele locale,
            activitățile culturale și
            proiectele dedicate copiilor
            contribuie la dezvoltarea unei
            comunități active și unite.
          </p>

          <div
            style={{
              position: "absolute",
              bottom: 15,
              left: 20,
              fontSize: 14,
              color: "#64748b",
              fontWeight: "bold",
            }}
          >
            4
          </div>
        </div>

        {/* PAGINA 5 */}

        <div
          style={{
            background: "#fff",
            padding: "35px",
            height: "100%",
            position: "relative",
          }}
        >
          <h1
            style={{
              color: "#0f3b75",
              borderBottom:
                "3px solid #f59e0b",
              paddingBottom: "10px",
            }}
          >
            Colectarea Selectivă
          </h1>

          <p
            style={{
              lineHeight: 1.9,
              fontSize: "16px",
            }}
          >
            Protejarea mediului începe cu
            fiecare dintre noi.
          </p>

          <p
            style={{
              lineHeight: 1.9,
              fontSize: "16px",
            }}
          >
            Primăria încurajează
            colectarea selectivă și
            utilizarea corespunzătoare a
            containerelor dedicate
            reciclării.
          </p>

          <div
            style={{
              marginTop: "25px",
              height: "260px",
              background: "#dcfce7",
              borderRadius: "10px",
            }}
          />

          <div
            style={{
              position: "absolute",
              bottom: 15,
              right: 20,
              fontSize: 14,
              color: "#64748b",
              fontWeight: "bold",
            }}
          >
            5
          </div>
        </div>
                {/* PAGINA 6 */}

        <div
          style={{
            background: "#faf8f5",
            padding: "35px",
            height: "100%",
            position: "relative",
          }}
        >
          <h1
            style={{
              color: "#0f3b75",
            }}
          >
            Investim în Viitor
          </h1>

          <ul
            style={{
              lineHeight: 2.2,
              fontSize: "17px",
            }}
          >
            <li>
              Modernizarea
              infrastructurii rutiere
            </li>

            <li>
              Dezvoltarea serviciilor
              digitale
            </li>

            <li>
              Îmbunătățirea iluminatului
              public
            </li>

            <li>
              Investiții în educație
            </li>

            <li>
              Proiecte de protecție a
              mediului
            </li>

            <li>
              Creșterea calității vieții
              cetățenilor
            </li>
          </ul>

          <div
            style={{
              position: "absolute",
              bottom: 15,
              left: 20,
              fontSize: 14,
              color: "#64748b",
              fontWeight: "bold",
            }}
          >
            6
          </div>
        </div>

        {/* PAGINA 7 */}

        <div
          style={{
            background: "#ffffff",
            padding: "35px",
            height: "100%",
            position: "relative",
          }}
        >
          <h1
            style={{
              color: "#0f3b75",
              marginTop: 0,
            }}
          >
            Servicii pentru Cetățeni
          </h1>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
              marginTop: "30px",
            }}
          >
            <div
              style={{
                padding: "15px",
                background: "#eff6ff",
                borderRadius: "8px",
              }}
            >
              Monitorul Oficial Local
            </div>

            <div
              style={{
                padding: "15px",
                background: "#eff6ff",
                borderRadius: "8px",
              }}
            >
              Consiliul Local
            </div>

            <div
              style={{
                padding: "15px",
                background: "#eff6ff",
                borderRadius: "8px",
              }}
            >
              Asistență Socială
            </div>

            <div
              style={{
                padding: "15px",
                background: "#eff6ff",
                borderRadius: "8px",
              }}
            >
              Informații de Interes Public
            </div>

            <div
              style={{
                padding: "15px",
                background: "#eff6ff",
                borderRadius: "8px",
              }}
            >
              Registratură Digitală
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 15,
              right: 20,
              fontSize: 14,
              color: "#64748b",
              fontWeight: "bold",
            }}
          >
            7
          </div>
        </div>
                {/* PAGINA 8 */}

        <div
          style={{
            background:
              "linear-gradient(180deg,#0f3b75,#071f43)",
            color: "white",
            padding: "35px",
            height: "100%",
            position: "relative",
          }}
        >
          <h1
            style={{
              marginTop: 0,
            }}
          >
            Contact
          </h1>

          <h2>
            Primăria Comunei Oarja
          </h2>

          <hr
            style={{
              margin: "20px 0",
              borderColor:
                "rgba(255,255,255,0.2)",
            }}
          />

          <p
            style={{
              fontSize: "18px",
              lineHeight: 2,
            }}
          >
            📞 0248 660 341
          </p>

          <p
            style={{
              fontSize: "18px",
              lineHeight: 2,
            }}
          >
            ✉ primarie@oarja.cjarges.ro
          </p>

          <p
            style={{
              fontSize: "18px",
              lineHeight: 2,
            }}
          >
            📍 Comuna Oarja, Argeș
          </p>

          <div
            style={{
              marginTop: "60px",
              padding: "20px",
              border:
                "1px solid rgba(255,255,255,0.2)",
              borderRadius: "10px",
            }}
          >
            <h3>
              Linkuri utile
            </h3>

            <p>
              • Consiliul Județean Argeș
            </p>

            <p>
              • Protecția Consumatorului
            </p>

            <p>
              • Portal ePrimaria
            </p>
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 15,
              left: 20,
              fontSize: 14,
              color: "#ffffff",
              fontWeight: "bold",
              opacity: 0.8,
            }}
          >
            8
          </div>
        </div>

      </HTMLFlipBook>
    </Box>
  );
}