import "./Developer.css";

const Developer = () => {
  return (
    <div className="developer-page">
      <div className="container">
        <div className="header">
          <h1>🏺 Pottery & Ceramics</h1>
          <p>
            A warm, earthy color palette inspired by clay, glazes, and natural
            materials
          </p>
        </div>

        <div className="palette-grid">
          <div className="color-section">
            <h3 className="section-title">Primary Colors</h3>
            <div className="color-group">
              <div className="color-item">
                <div
                  className="color-swatch"
                  style={{ background: "#8b4513" }}
                ></div>
                <div className="color-info">
                  <div className="color-name">Clay Brown</div>
                  <div className="color-hex">#8b4513</div>
                  <div className="usage-note">
                    Main brand color, headers, navigation
                  </div>
                </div>
              </div>
              <div className="color-item">
                <div
                  className="color-swatch"
                  style={{ background: "#d2691e" }}
                ></div>
                <div className="color-info">
                  <div className="color-name">Terracotta</div>
                  <div className="color-hex">#d2691e</div>
                  <div className="usage-note">
                    Accent color, buttons, highlights
                  </div>
                </div>
              </div>
              <div className="color-item">
                <div
                  className="color-swatch"
                  style={{ background: "#f5f1eb" }}
                ></div>
                <div className="color-info">
                  <div className="color-name">Cream</div>
                  <div className="color-hex">#f5f1eb</div>
                  <div className="usage-note">
                    Background, cards, light sections
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="color-section">
            <h3 className="section-title">Secondary Colors</h3>
            <div className="color-group">
              <div className="color-item">
                <div
                  className="color-swatch"
                  style={{ background: "#a0522d" }}
                ></div>
                <div className="color-info">
                  <div className="color-name">Sienna</div>
                  <div className="color-hex">#a0522d</div>
                  <div className="usage-note">Secondary actions, borders</div>
                </div>
              </div>
              <div className="color-item">
                <div
                  className="color-swatch"
                  style={{ background: "#daa520" }}
                ></div>
                <div className="color-info">
                  <div className="color-name">Glaze Gold</div>
                  <div className="color-hex">#daa520</div>
                  <div className="usage-note">
                    Special highlights, achievements
                  </div>
                </div>
              </div>
              <div className="color-item">
                <div
                  className="color-swatch"
                  style={{ background: "#e8ddd4" }}
                ></div>
                <div className="color-info">
                  <div className="color-name">Bone</div>
                  <div className="color-hex">#e8ddd4</div>
                  <div className="usage-note">Subtle backgrounds, dividers</div>
                </div>
              </div>
            </div>
          </div>

          <div className="color-section">
            <h3 className="section-title">Status Colors</h3>
            <div className="color-group">
              <div className="color-item">
                <div
                  className="color-swatch"
                  style={{ background: "#6b8e23" }}
                ></div>
                <div className="color-info">
                  <div className="color-name">Sage Green</div>
                  <div className="color-hex">#6b8e23</div>
                  <div className="usage-note">Success, completed pieces</div>
                </div>
              </div>
              <div className="color-item">
                <div
                  className="color-swatch"
                  style={{ background: "#cd853f" }}
                ></div>
                <div className="color-info">
                  <div className="color-name">Bisque</div>
                  <div className="color-hex">#cd853f</div>
                  <div className="usage-note">In progress, firing stage</div>
                </div>
              </div>
              <div className="color-item">
                <div
                  className="color-swatch"
                  style={{ background: "#4682b4" }}
                ></div>
                <div className="color-info">
                  <div className="color-name">Glaze Blue</div>
                  <div className="color-hex">#4682b4</div>
                  <div className="usage-note">Information, drying stage</div>
                </div>
              </div>
            </div>
          </div>

          <div className="color-section">
            <h3 className="section-title">Neutrals</h3>
            <div className="color-group">
              <div className="color-item">
                <div
                  className="color-swatch"
                  style={{ background: "#5d4037" }}
                ></div>
                <div className="color-info">
                  <div className="color-name">Dark Clay</div>
                  <div className="color-hex">#5d4037</div>
                  <div className="usage-note">Text, dark elements</div>
                </div>
              </div>
              <div className="color-item">
                <div
                  className="color-swatch"
                  style={{ background: "#8d6e63" }}
                ></div>
                <div className="color-info">
                  <div className="color-name">Medium Clay</div>
                  <div className="color-hex">#8d6e63</div>
                  <div className="usage-note">Secondary text, icons</div>
                </div>
              </div>
              <div className="color-item">
                <div
                  className="color-swatch"
                  style={{ background: "#ffffff" }}
                ></div>
                <div className="color-info">
                  <div className="color-name">Pure White</div>
                  <div className="color-hex">#ffffff</div>
                  <div className="usage-note">Cards, clean backgrounds</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="demo-section">
          <h3 className="demo-title">App Interface Preview</h3>
          <div className="app-mockup">
            <div className="mockup-card">
              <div className="mockup-header">🏺 My Pottery</div>
              <div className="mockup-item status-complete">
                ✓ Vase #1 - Completed
              </div>
              <div className="mockup-item status-firing">
                🔥 Bowl Set - Firing
              </div>
              <div className="mockup-item status-drying">
                💧 Mug #3 - Drying
              </div>
            </div>
            <div className="mockup-card">
              <div className="mockup-header">📊 Progress</div>
              <div className="mockup-item">15 pieces completed</div>
              <div className="mockup-item">3 currently in progress</div>
              <div className="mockup-item">Next firing: Tomorrow</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Developer;
