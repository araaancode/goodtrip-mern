import TemplatePointers from "./components/TemplatePointers"

function LandingIntro() {

  return (
    <div className="hero min-h-full rounded-l-xl bg-base-200">
      <div className="hero-content py-12">
        <div className="max-w-md">
          <h1 className="mb-10 text-center font-bold text-lg">ورود به پنل مدیریت</h1>
          <div className="text-center mt-0 mb-35"><img src="../intro.jpeg" alt="اقامتگاه" className="w-full rounded rounded-lg inline-block shadow-md"></img></div>
          <TemplatePointers />
        </div>
      </div>
    </div>
  )

}

export default LandingIntro