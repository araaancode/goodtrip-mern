import TitleCard from "../../../components/Cards/TitleCard"

const userSourceData = [
    {source : "تبلیغات فیسبوک", count : "0", conversionPercent : 0},
    {source : "تبلیغات سایت ها", count : "0", conversionPercent : 0},
    {source : "تبلیغات اینستاگرام", count : "0", conversionPercent : 0},
    {source : "بازاریابی وابسته", count : "0", conversionPercent : 0},
    {source : "شرکت ها", count : "0", conversionPercent : 0},
]

function UserChannels(){
    return(
        <TitleCard title={"ثبت نام کاربران"}>
             {/** Table Data */}
             <div className="overflow-x-auto">
                <table dir="rtl" className="table w-full">
                    <thead>
                    <tr>
                        <th></th>
                        <th className="normal-case">منبع</th>
                        <th className="normal-case">تعداد کاربران</th>
                        <th className="normal-case">درصد</th>
                    </tr>
                    </thead>
                    <tbody>
                        {
                            userSourceData.map((u, k) => {
                                return(
                                    <tr key={k}>
                                        <th>{k+1}</th>
                                        <td>{u.source}</td>
                                        <td>{u.count}</td>
                                        <td>{`${u.conversionPercent}%`}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </TitleCard>
    )
}

export default UserChannels