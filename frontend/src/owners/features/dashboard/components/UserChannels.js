import TitleCard from "../../../components/Cards/TitleCard"

const userSourceData = [
    {source : "تبلیغات فیسبوک", count : "۲۶۳۴۵", conversionPercent : 10.2},
    {source : "تبلیغات سایت ها", count : "۲۱۳۴۱", conversionPercent : 11.7},
    {source : "تبلیغات اینستاگرام", count : "۳۴۳۷۹", conversionPercent : 12.4},
    {source : "بازاریابی وابسته", count : "۱۲۳۵۹", conversionPercent : 20.9},
    {source : "شرکت ها", count : "۱۰۳۴۵", conversionPercent : 10.3},
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