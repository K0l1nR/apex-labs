export const ErrorMessages = {
  Common: {
    ArrayField: 'Значение должно быть массивом',
    ArrayNotEmpty: 'Массив не может быть пустым',
    BooleanField: 'Поле может иметь значение true или false',
    DateField: 'Неверный формат даты',
    MinEndPublishDate: 'Дата не может быть ранее даты публикации',
    NotFoundElements: 'Элементы не найдены',
    NotFoundOneElement: 'Элемент не найден',
    NumberField: 'Значение должно быть целым числом',
    RequiredField: 'Обязательное поле',
    StringField: 'Значение должно быть строкой',
    UrlField: 'Значение должено быть URL-адресом',
    UUID: 'Введите корректный id',
  },
  User: {
    NotFound: "User doesn't exist",
    AlreadyExist: 'A user with such data is already registered in the system',
    WrongPassword: 'Password is incorrect'
  },
  Token: {
    NotFound: "Token doesn't exist",
    Invalid: 'Invalid Token',
    DecodeError: 'Error while decoding token',
  },
  Request: {
    BadRequestException: 'BadRequestException'
  }
};
