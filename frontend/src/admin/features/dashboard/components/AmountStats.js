

function AmountStats({}){
    return(
        <div className="stats bg-base-100 shadow">
            <div className="stat">
                <div className="stat-title">میزان جمع آوری شده</div>
                <div className="stat-value">0</div>
                <div className="stat-actions">
                    <button className="btn btn-xs">دیدن کاربران</button> 
                </div>
            </div>
            
            <div className="stat">
                <div className="stat-title">درآمد</div>
                <div className="stat-value">0</div>
                <div className="stat-actions">
                    <button className="btn btn-xs">دیدن اعضا</button> 
                </div>
            </div>
        </div>
    )
}

export default AmountStats