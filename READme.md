초기 설정

- datetimepickermodal 다운 : https://www.npmjs.com/package/react-native-modal-datetime-picker
- asyncstorage 다운 : https://docs.expo.dev/versions/latest/sdk/async-storage/

오류

- 맨 처음 실행 시 loadtodo에서 STORAGE_KEY 값이 null 값이라 이거 해결 해야할듯
  => 52줄 setToDos(JSON.parse(s)); 주석 처리 후 저장 한 뒤 할 일 하나 추가 한 뒤 refresh하고 다시 풀어놓고 저장하면 정상 동작
