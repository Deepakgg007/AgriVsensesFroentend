
type SearchOpneProps = {
  serchOpen: boolean
  setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function SearchBar({ serchOpen, setSearchOpen }: SearchOpneProps) {
  return (
    <>
      <div className="search-wrap" style={{ display: serchOpen ? "block" : "none" }}>
        <div className="search-inner">
          <button
            type="button"
            className="fas fa-times search-close"
            id="search-close"
            aria-label="Close search"
            onClick={() => setSearchOpen(false)}
          />

          <div className="search-cell">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="search-field-holder">
                <input type="search" aria-label="Search site" className="main-search-input" placeholder="Search..." />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
