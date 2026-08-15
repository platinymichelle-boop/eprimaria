import React, { forwardRef } from "react";

export interface NewsElement {
  id: string;
  page_id: string;
  type: "text" | "image" | "shape";
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  image_url?: string;
  font_family?: string;
  font_size?: number;
  font_weight?: string;
  font_style?: string;
  color?: string;
  text_align?: "left" | "center" | "right" | "justify";
  columns?: number;
  line_height?: number;
  letter_spacing?: number;
  drop_cap?: boolean;
  border_color?: string;
  border_style?: "none" | "solid" | "dashed" | "double";
  border_width?: number;
  border_radius?: number;
  opacity?: number;
  z_index: number;
  shape_type?: "line" | "rectangle" | "circle";
}

export interface NewsPageData {
  id: string;
  edition_id: string;
  page_number: number;
  background_color: string;
}

interface NewspaperPageProps {
  page: NewsPageData;
  elements: NewsElement[];
}

export const NewspaperPage = forwardRef<HTMLDivElement, NewspaperPageProps>(
  ({ page, elements }, ref) => {
    const sortedElements = elements.slice().sort((a, b) => a.z_index - b.z_index);

    // Dimensiunile maxime ale foii de ziar
    const PAGE_WIDTH = 700;
    const PAGE_PADDING = 30; // Marginea de siguranță stânga-dreapta în interiorul paginii
    const AVAILABLE_WIDTH = PAGE_WIDTH - PAGE_PADDING * 2; // Spațiul maxim util (640px)

    return (
      <div
        ref={ref}
        className="newspaper-page"
        style={{
          width: `${PAGE_WIDTH}px`,
          height: "900px",
          backgroundColor: page.background_color || "#ffffff",
          position: "relative",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        {/* CONTAINER SCROLLABIL INTELIGENT */}
        <div
          className="newspaper-content-scroll"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            bottom: "45px",
            overflowY: "auto", 
            overflowX: "hidden",
            padding: `25px ${PAGE_PADDING}px 10px ${PAGE_PADDING}px`,
            boxSizing: "border-box",
          }}
        >
          {sortedElements.map((el) => {
            // --- PROTECȚIE ÎMPOTRIVA TĂIERII TEXTULUI ---
            // Dacă elementul începe prea în dreapta, îl limităm ca să nu iasă din pagină
            const correctedX = el.x > AVAILABLE_WIDTH ? AVAILABLE_WIDTH - 100 : el.x;
            
            // Calculăm o lățime maximă permisă pentru ca elementul să rămână în interiorul foii
            const maxAllowedWidth = AVAILABLE_WIDTH - correctedX;
            
            // Dacă lățimea din baza de date este prea mare și dă pe afară, o micșorăm automat la maximul permis
            const correctedWidth = el.width > maxAllowedWidth ? maxAllowedWidth : el.width;

            const baseStyle: React.CSSProperties = {
              position: "absolute",
              left: `${correctedX}px`,
              top: `${el.y}px`,
              width: `${correctedWidth}px`,
              height: el.type === "text" ? "auto" : `${el.height}px`, // Textul primește auto ca să poată curge în jos pe rândurile noi
              minHeight: el.type === "text" ? `${el.height}px` : undefined,
              zIndex: el.z_index,
              opacity: el.opacity ?? 1,
              boxSizing: "border-box",
            };

            // 1. RANDARE TEXT
            if (el.type === "text") {
              const isTitle = (el.font_size ?? 0) >= 20;

              return (
                <div
                  key={el.id}
                  className={el.drop_cap ? "newspaper-dropcap" : ""}
                  style={{
                    ...baseStyle,
                    fontFamily:
                      el.font_family ||
                      (isTitle
                        ? "'Playfair Display', serif"
                        : "'Merriweather', serif"),
                    fontSize: `${el.font_size || 13}px`,
                    fontWeight: el.font_weight || "normal",
                    fontStyle: el.font_style || "normal",
                    color: el.color || "#111111",
                    textAlign: el.text_align || "justify",
                    lineHeight: el.line_height || 1.4,
                    letterSpacing: `${el.letter_spacing || 0}px`,
                    columnCount: el.columns || 1,
                    columnGap: "20px",
                    wordBreak: "break-word", // Sparge cuvintele extrem de lungi dacă este cazul
                    whiteSpace: "normal",    // Permite textului să treacă natural pe rândul următor
                  }}
                >
                  {el.content}
                </div>
              );
            }

            // 2. RANDARE IMAGINE
            if (el.type === "image" && el.image_url) {
              return (
                <div
                  key={el.id}
                  style={{
                    ...baseStyle,
                    overflow: "hidden",
                    borderRadius: `${el.border_radius || 0}px`,
                  }}
                >
                  <img
                    src={el.image_url}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              );
            }

            // 3. FORME GEOMETRICE
            if (el.type === "shape") {
              if (el.shape_type === "line") {
                return (
                  <div
                    key={el.id}
                    style={{
                      ...baseStyle,
                      height: `${el.border_width || 1}px`,
                      backgroundColor: el.border_color || "#111111",
                    }}
                  />
                );
              }

              return (
                <div
                  key={el.id}
                  style={{
                    ...baseStyle,
                    border: `${el.border_width || 1}px ${
                      el.border_style || "solid"
                    } ${el.border_color || "#111111"}`,
                    borderRadius: el.shape_type === "circle" ? "50%" : `${el.border_radius || 0}px`,
                  }}
                />
              );
            }

            return null;
          })}
        </div>

        {/* NUMĂRUL PAGINII */}
        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: "12px",
            color: "#888",
            fontWeight: "bold",
            backgroundColor: page.background_color || "#ffffff",
            paddingTop: "5px",
            zIndex: 100,
          }}
        >
          {page.page_number}
        </div>
      </div>
    );
  }
);

NewspaperPage.displayName = "NewspaperPage";
