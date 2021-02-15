const Modal = (props) => {

    const { children, show } = props
    return (
        <>
        {show?
        <div className="modalcontainer">
            {children}
        </div>
        :null
        }
        </>
    )
}

export default Modal