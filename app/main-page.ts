
import { EventData, isIOS, Label, Page } from '@nativescript/core'
import { getLabelColor } from '@nativescript/core/ui/dialogs'
import { HelloWorldModel } from './main-view-model'

export function navigatedTo(args: EventData) {
  const page = <Page>args.object

  page.bindingContext = new HelloWorldModel()

  if (isIOS) {
    page.on('navigatedTo', () => {
      page.frame.ios.controller.navigationBar.prefersLargeTitles = true;
    })
  }
}

export function onTimeLoaded(args: EventData) {
  const label = <Label>args.object;


  const model = <HelloWorldModel>label.page.bindingContext;

  model.on('propertyChange', () => {
    setTimeout(() => {
      const dateTime = new Date(new Date().toLocaleDateString() + ' '+label.text+':00');
      if(dateTime < new Date()){
        label.setProperty('color', 'gray');
      }
    }, 1);
  })
}
