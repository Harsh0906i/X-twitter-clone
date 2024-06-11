import {atom} from 'recoil';
export const modelState=atom({
  key:'modelState',
  default :false,  
});
export const cpostId=atom({
  key:'cpostId',
  default :'',  
});