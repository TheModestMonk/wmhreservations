// import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({
//     name: 'myfilter',
//     pure: false
// })
// export class MyFilterPipe implements PipeTransform {
//     transform(items: any[], filter: Object): any {
//         if (!items || !filter) {
//             return items;
//         }
//         let filterpName : string = filter["PartyName"];
//         let filterrDate : Date = filter["ReservationDtm"];
//         let filterrSize : number = filter["ReservationSize"];
//         let filteraFlag : boolean = filter["ArrivedFlag"];

//         let rtnItems = items;
//         if (filterpName !== null){
//             rtnItems = rtnItems.filter(item => item.PartyName.indexOf(filterpName) !== -1);
//         }
//         if (filterrDate !== null){
//             rtnItems = rtnItems.filter(item => item.ReservationDtm >= filterrDate);
//         }
//         if (filterrSize !== null){
//             rtnItems = rtnItems.filter(item => item.PartyName === filterrSize);
//         }
//         if (filteraFlag !== null){
//             rtnItems = rtnItems.filter(item => item.ArrivedFlag === filteraFlag);
//         }
//     }
// }