import { ApplicationSettings, Color, EventData, HttpResponseEncoding, isAndroid, Label, Observable, prompt  } from '@nativescript/core'
import { LocalNotifications } from '@nativescript/local-notifications';


export class HelloWorldModel extends Observable {
  private location = {
    city: '',
    country: '',
  };

  private timings = {
    Fajr: "Loading...",
    Sunrise: "Loading...",
    Dhuhr: "Loading...",
    Asr: "Loading...",
    Sunset: "Loading...",
    Maghrib: "Loading...",
    Isha: "Loading...",
    Imsak: "Loading...",
    Midnight: "Loading...",
  };

  constructor() {
    super()
    this.getLocation()
    this.getPrayerTimes();
    this.requestPermission();
  }

   getLocation () {
     console.log(ApplicationSettings.getString('location'))
     if(ApplicationSettings.getString('location')){
       this.setProperty('location', JSON.parse(ApplicationSettings.getString('location')));
     }
     else {
       this.editLocation();
     }
  }

  editLocation () {
    prompt({
      okButtonText: 'Next',
      message: 'Country',
      cancelable: true,
      cancelButtonText: 'Cancel'
    }).then(input =>{
      if(input.text !== ''){
        const country = input.text
        prompt({
        okButtonText: 'Save',
        message: 'City',
        cancelable: true,
        cancelButtonText: 'Cancel'
        }).then(input => {
          if(input.text !== ''){
            const city = input.text
            console.log(country +' ' +city)
            this.saveLocation(country, city);
          }
        })
      }
      }
    );

  }

  saveLocation(country: string, city: string) {
    ApplicationSettings.setString('location', JSON.stringify({
      country: country,
      city: city
    }));

    this.getLocation();
    this.getPrayerTimes();
    this.setNotificationForToday();
  }

  getPrayerTimes() {


    global.http.request({
      method: 'get',
      url: '/timingsByCity?city='+this.location.city+'&country='+this.location.country+'&method=4'
    }).then(response => {
      console.log(response)
      this.setProperty('timings', response.content.toJSON().data.timings);
      ApplicationSettings.setString('timings', JSON.stringify(response.content.toJSON().data.timings));
      this.setNotificationForToday()
    }).catch((error) => {
      console.log(error)
      if(ApplicationSettings.getString('timings')){
        this.setProperty('timings', JSON.stringify(ApplicationSettings.getString('timings')))
      }
    })
  }

  times() {
    console.log(this.timings)
  }

  savePrayerTimes() {

  }


  requestPermission () {
    LocalNotifications.requestPermission().then(
      function(granted) {
        console.log("Permission granted? " + granted);
      }
    )
  }

  setNotificationForToday () {
    let date = new Date();
    date.setSeconds(date.getSeconds() + 10)
    LocalNotifications.cancelAll().then(() =>{

      LocalNotifications.schedule([
      {
        title: 'Fajr',
        body: 'Go pray',
        at: new Date(new Date().toLocaleDateString() + ' '+this.timings.Fajr+':00')
      },
      {
        title: 'Dhuhr',
        body: 'Go pray',
        at: new Date(new Date().toLocaleDateString() + ' '+this.timings.Dhuhr+':00')
      },
      {
        title: 'Asr',
        body: 'Go pray',
        at: new Date(new Date().toLocaleDateString() + ' '+this.timings.Asr+':00')
      },
      {
        title: 'Maghrib',
        body: 'Go pray',
        at: new Date(new Date().toLocaleDateString() + ' '+this.timings.Maghrib+':00')
      },
      {
        title: 'Isha',
        body: 'Go pray',
        at: new Date(new Date().toLocaleDateString() + ' '+this.timings.Isha+':00')
      }
      ]).then(notification => {
        console.log(notification);
      }).catch(error => {
        console.log(error)
      });
    })
  }

  onTimeLoaded(args: EventData) {
    const label = <Label>args.object;

    console.log(label)
  }
}
