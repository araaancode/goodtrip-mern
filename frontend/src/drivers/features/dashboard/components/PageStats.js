import HeartIcon  from '@heroicons/react/24/outline/HeartIcon'
import BoltIcon  from '@heroicons/react/24/outline/BoltIcon'


function PageStats({}){
    return(
        <div className="stats bg-base-100 shadow">
  
  <div className="stat">
    <div className="stat-figure invisible md:visible">
        <HeartIcon className='w-8 h-8'/>
    </div>
    <div className="stat-title">کل اجاره ها و علاقه مندی ها</div>
    <div className="stat-value">۲۵.۶K</div>
    <div className="stat-desc"> بیست درصد بیشتر از ماه گذشته</div>
  </div>
  
  <div className="stat">
    <div className="stat-figure invisible md:visible">
        <BoltIcon className='w-8 h-8'/>
    </div>
    <div className="stat-title">بازدید از سایت</div>
    <div className="stat-value">۲.۶M</div>
    <div className="stat-desc">چهارده درصد بیشتر از ماه گذشته</div>
  </div>
</div>
    )
}

export default PageStats