import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { showNotification, setPageTitle } from "../features/common/headerSlice"
import TitleCard from "../components/Cards/TitleCard"
import moment from "moment"

const INITIAL_INTEGRATION_LIST = [
  { name: "غذادار یک ", icon: "https://media.istockphoto.com/id/1495400818/photo/happy-chef-holding-a-plate-at-a-fine-dining-restaurant.webp?b=1&s=170667a&w=0&k=20&c=VCxR6WTRpNcrZzBv8_Kkz05oeYbHUQAHQS8OHC3OEzc=", isActive: true, description: "از اینجا می توانید غذادار را تایید یا رد کنید" },
  { name: "غذادار دو ", icon: "https://media.istockphoto.com/id/666908954/photo/handsome-chef-pouring-olive-oil-on-meal.webp?b=1&s=170667a&w=0&k=20&c=n5gq9dCc1i5e8XjXSfGPm-vBQDZaEU7kVGETVfLsYk4=", isActive: true, description: "از اینجا می توانید غذادار را تایید یا رد کنید" },
  { name: "غذادار سه ", icon: "https://media.istockphoto.com/id/1354214281/photo/happy-chef-leading-a-group-of-cooks-in-the-kitchen-of-a-restaurant.webp?b=1&s=170667a&w=0&k=20&c=BMRiQ7X9OLrYP6A4Df_C4uh6TFr2HzMHSPIpGavvMHc=", isActive: true, description: "از اینجا می توانید غذادار را تایید یا رد کنید" },
  {
    name: "غذادار چهار ", icon: "https://plus.unsplash.com/premium_photo-1661778032392-28cecebb8059?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Q2hlZnxlbnwwfHwwfHx8MA%3D%3D",
    isActive: true, description: "از اینجا می توانید غذادار را تایید یا رد کنید"
  },
  { name: "غذادار پنج ", icon: "https://media.istockphoto.com/id/1401772072/photo/skilled-gastronomy-expert-garnishing-gourmet-dish-with-parmesan-cheese-in-restaurant.webp?b=1&s=170667a&w=0&k=20&c=wFw6L5E7dNA7NJfl_32WbyJLG6hV32_5RxaolKdcH48=", isActive: true, description: "از اینجا می توانید غذادار را تایید یا رد کنید" },

  { name: "غذادار شش ", icon: "https://media.istockphoto.com/id/1462214323/photo/its-a-deal-on-your-new-business.webp?b=1&s=170667a&w=0&k=20&c=NDJvbn_3eMuMSy28fqo_yvYfDm0S2XVe-3wO-IcNmR0=", isActive: true, description: "از اینجا می توانید غذادار را تایید یا رد کنید" },
  
]

function Cooks() {

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setPageTitle({ title: "تایید یا عدم تایید غذادار " }))
  }, [])


  const [integrationList, setIntegrationList] = useState(INITIAL_INTEGRATION_LIST)


  const updateIntegrationStatus = (index) => {
    let integration = integrationList[index]
    setIntegrationList(integrationList.map((i, k) => {
      if (k === index) return { ...i, isActive: !i.isActive }
      return i
    }))
    dispatch(showNotification({ message: `${integration.name} ${integration.isActive ? "رد شد" : "تایید شد"}`, status: 1 }))
  }


  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-200">
        {
          integrationList.map((i, k) => {
            return (
              <TitleCard key={k} title={i.name} topMargin={"mt-2"}>

                <p className="flex flex-col">
                  <img alt="icon" src={i.icon} className="w-full h-50 inline-block ml-4" />
                  <span className="mt-4">{i.description}</span>
                </p>
                <div className="mt-6 mb-0 text-right">
                  <input type="checkbox" className="toggle toggle-success toggle-lg" checked={i.isActive} onChange={() => updateIntegrationStatus(k)} />
                </div>
              </TitleCard>
            )

          })
        }
      </div>
    </>
  )
}

export default Cooks