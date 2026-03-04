interface SaveModalProps {
  isOpen: boolean
  onClose: () => void
  paintTitle: string
  setPaintTitle: (title: string) => void
  onSave: () => void
}

function SaveModal({ isOpen, onClose, paintTitle, setPaintTitle, onSave }: SaveModalProps) {
  if (!isOpen) return null

  return (
    <div className="modal__overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal__content">
        <h2>Enter the paint title to proceed</h2>
        <input
          className="modal__input"
          type="text"
          placeholder="Title"
          value={paintTitle}
          onChange={(e) => setPaintTitle(e.target.value)}
        />
        <button className="modal__button" disabled={!paintTitle} onClick={onSave}>
          Confirm
        </button>
      </div>
    </div>
  )
}

export default SaveModal