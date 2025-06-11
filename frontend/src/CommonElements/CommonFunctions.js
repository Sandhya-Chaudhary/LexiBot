import { notification } from 'antd';


// notification.config({
//   placement: "topRight",
//   duration: 3,
//   maxCount: 3
// });

export const showErrorNotification = (errorMessage) => {
    console.log("ajsajk")
  notification.error({
    message: "Error",
    description: errorMessage,
  });
};
