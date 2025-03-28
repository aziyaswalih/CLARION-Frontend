import { FC } from "react"

interface Props{
    message:string
}

const AlertMessage:FC<Props> = ({message}) => {
  return (
    <div>
        {message}
      
    </div>
  )
}
export default AlertMessage
