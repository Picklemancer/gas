const EN = {
  order: 'Order',
  town: 'Town',
  fuel: 'Fuel',
  amount: 'Amount',
  stations: 'Stations',
};

const ES = {
  order: 'Ordenar',
  town: 'Municipio',
  fuel: 'Combustible',
  amount: 'Importe',
  stations: 'Estaciones',
};

const values = { EN, ES };

const idioma = 'ES';

export const language = (key) => values[idioma][key] || key;

export default language;
