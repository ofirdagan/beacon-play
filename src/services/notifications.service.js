const PushNotification = require('react-native-push-notification');

class NotificationsService {

  constructor() {
    PushNotification.configure({
      onRegister: function(token) {
        console.log( 'TOKEN:', token );
      },
      onNotification: function(notification) {
        console.log( 'NOTIFICATION:', notification );
      },
      requestPermissions: true
    });
  }
  pushLocalNotification(message) {
    PushNotification.localNotification({
      /* iOS and Android properties */
      title: "Beacon Play", // (optional, for iOS this is only used in apple watch, the title will be the app name on other iOS devices)
      message,
      alertAction: 'view',
      playSound: true,
      soundName: 'default',
    });
  }
}

export default new NotificationsService();