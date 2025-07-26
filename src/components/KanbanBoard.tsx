import './KanbanBoard.css'
import PotteryCard from './PotteryCard'

const KanbanBoard = () => {
  return (
    <div className="kanban-container">
      <div className="kanban-board">
        {/* Ideas Column */}
        <div className="column ideas">
          <div className="column-header">
            <div className="column-title">
              <span className="stage-icon">💡</span>
              Ideas
            </div>
            <div className="column-count">3</div>
          </div>
          <div className="card-list">
            <PotteryCard
              title="Japanese Tea Set"
              type="Service Set"
              details="Inspired by traditional Raku techniques. Planning 6 cups, teapot, and serving tray with earthy glazes."
              date="Started Jul 20"
              priority="high"
            />
            <PotteryCard
              title="Garden Planters"
              type="Functional"
              details="Large outdoor planters with drainage. Considering textured surfaces and weatherproof glazes."
              date="Started Jul 18"
              priority="medium"
            />
            <PotteryCard
              title="Abstract Sculpture"
              type="Art Piece"
              details="Exploring organic forms and negative space. Sketching concepts for gallery submission."
              date="Started Jul 15"
              priority="low"
            />
          </div>
          <button className="add-card-btn">+ Add new idea</button>
        </div>

        {/* Throw Column */}
        <div className="column throw">
          <div className="column-header">
            <div className="column-title">
              <span className="stage-icon">🏺</span>
              Throw
            </div>
            <div className="column-count">4</div>
          </div>
          <div className="card-list">
            <PotteryCard
              title="Large Serving Bowl"
              type="Functional"
              details="14″ diameter bowl for salads. Using speckled stoneware clay. Need to center 3lbs of clay."
              date="Throwing today"
              priority="high"
            />
            <PotteryCard
              title="Coffee Mugs (Set of 6)"
              type="Functional"
              details="12oz mugs with comfortable handles. Throwing in batches to ensure consistency."
              date="In progress"
              priority="medium"
            />
            <PotteryCard
              title="Decorative Vase"
              type="Art Piece"
              details="Tall narrow form with flared rim. Experimenting with pulled handles and texture."
              date="Next session"
              priority="low"
            />
            <PotteryCard
              title="Chip & Dip Set"
              type="Functional"
              details="Large plate with fitted bowl. Planning complementary glazes in blues and whites."
              date="Tomorrow"
              priority="medium"
            />
          </div>
          <button className="add-card-btn">+ Add piece to throw</button>
        </div>

        {/* Trim Column */}
        <div className="column trim">
          <div className="column-header">
            <div className="column-title">
              <span className="stage-icon">🔧</span>
              Trim
            </div>
            <div className="column-count">2</div>
          </div>
          <div className="card-list">
            <PotteryCard
              title="Pasta Bowls (Set of 4)"
              type="Functional"
              details="Wide shallow bowls. Need to trim foot rings and refine rim. Clay at perfect leather-hard stage."
              date="Ready to trim"
              priority="high"
            />
            <PotteryCard
              title="Ceramic Lamp Base"
              type="Functional"
              details="Cylindrical form with cord hole. Need to clean up base and add signature stamp."
              date="Drying since Jul 22"
              priority="medium"
            />
          </div>
          <button className="add-card-btn">+ Add piece to trim</button>
        </div>

        {/* Bisque Column */}
        <div className="column bisque">
          <div className="column-header">
            <div className="column-title">
              <span className="stage-icon">🔥</span>
              Bisque
            </div>
            <div className="column-count">5</div>
          </div>
          <div className="card-list">
            <PotteryCard
              title="Dinner Plates (Set of 8)"
              type="Functional"
              details="10″ plates with subtle rim detail. Scheduled for next bisque firing on Friday."
              date="Firing Jul 28"
              priority="high"
            />
            <PotteryCard
              title="Teapot"
              type="Functional"
              details="32oz capacity with bamboo-style handle. Spout needs final smoothing before firing."
              date="Currently firing"
              priority="medium"
            />
            <PotteryCard
              title="Wall Tiles (12 pieces)"
              type="Architectural"
              details="6″x6″ decorative tiles with impressed patterns. Part of bathroom renovation project."
              date="Next load"
              priority="low"
            />
          </div>
          <button className="add-card-btn">+ Add to bisque queue</button>
        </div>

        {/* Glaze Column */}
        <div className="column glaze">
          <div className="column-header">
            <div className="column-title">
              <span className="stage-icon">🎨</span>
              Glaze
            </div>
            <div className="column-count">3</div>
          </div>
          <div className="card-list">
            <PotteryCard
              title="Salad Bowl & Servers"
              type="Functional"
              details="Large bowl with wooden servers. Planning celadon green glaze with clear interior."
              date="Glazing today"
              priority="high"
            />
            <PotteryCard
              title="Bud Vases (Set of 3)"
              type="Decorative"
              details="Small vases in varying heights. Testing new copper red glaze combination."
              date="Test glazes"
              priority="medium"
            />
            <PotteryCard
              title="Casserole Dish"
              type="Functional"
              details="2-quart covered dish with knob handle. Using food-safe matte glaze in warm brown."
              date="Glaze tomorrow"
              priority="medium"
            />
          </div>
          <button className="add-card-btn">+ Add to glaze queue</button>
        </div>

        {/* Finished Column */}
        <div className="column finished">
          <div className="column-header">
            <div className="column-title">
              <span className="stage-icon">✨</span>
              Finished
            </div>
            <div className="column-count">6</div>
          </div>
          <div className="card-list">
            <PotteryCard
              title="Espresso Cups (Set of 4)"
              type="Functional"
              details="Perfect 3oz cups with matching saucers. Glossy black glaze with gold rim accent."
              date="Completed Jul 24"
              priority="high"
              priorityLabel="Gift Set"
            />
            <PotteryCard
              title="Fruit Bowl"
              type="Functional"
              details="Large centerpiece bowl with fluted edges. Beautiful blue-green gradient glaze."
              date="Completed Jul 22"
              priority="medium"
              priorityLabel="Personal"
            />
            <PotteryCard
              title="Sculptural Vessel"
              type="Art Piece"
              details="Contemporary form with carved surface texture. Matte white glaze highlights the details."
              date="Completed Jul 20"
              priority="low"
              priorityLabel="Portfolio"
            />
          </div>
          <button className="add-card-btn">+ Archive completed piece</button>
        </div>
      </div>
    </div>
  )
}

export default KanbanBoard
