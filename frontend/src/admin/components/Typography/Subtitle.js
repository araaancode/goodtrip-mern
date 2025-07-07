 function Subtitle({styleClass, children}){
    return(
        <div className={`text-xl font-semibold text-right ${styleClass}`}>{children}</div>
    )
}

export default Subtitle