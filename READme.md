설치 라이브러리

- datetimepickermodal : https://www.npmjs.com/package/react-native-modal-datetime-picker
- asyncstorage : https://docs.expo.dev/versions/latest/sdk/async-storage/
- React Navigation : https://reactnative.dev/docs/navigation

참고

- navigation header options : https://reactnavigation.org/docs/native-stack-navigator/#options

오류

- 맨 처음 실행 시 loadtodo에서 STORAGE_KEY 값이 null 값이라 이거 해결 해야할듯
  => 52줄 setToDos(JSON.parse(s)); 주석 처리 후 저장 한 뒤 할 일 하나 추가 한 뒤 refresh하고 다시 풀어놓고 저장하면 정상 동작
  => null값 일 때 기본 제공 내용 추가하니 해결 ✅
