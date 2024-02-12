import './style.css';
import COMBUSTIBLES from './combustibles.json';
import GASOLINERAS from './gasolineras.json';
import React, { useEffect, useState, useRef } from 'react';
import wretch from 'wretch';
import QueryStringAddon from 'wretch/addons/queryString';
import { between, head, distanceInKmBetweenEarthCoordinates } from './utils';
import Box from './components/Box';
import Text from './components/Text';
import Button from './components/Button';
import Select from './components/Select';
import Card, { CardBody } from './components/Card';
import language from './language';
import View from './components/View';
import Chip from './components/Chip';
import Loading from './components/Loading';
import Image from './components/Image';
import NumberInput from './components/NumberInput';
import useGeolocation from './hooks/useGeolocation';

// para hacer peticiones en el navegador: https://restninja.io
// obtener datos de precios: https://geoportalgasolineras.es/geoportal-instalaciones/DescargarFicheros

// type OpenStreetMapResponse = {
//   place_id: 287590979;
//   licence: 'Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright';
//   osm_type: 'way';
//   osm_id: 211738938;
//   lat: '36.42970413095955';
//   lon: '-5.171452774735122';
//   class: 'highway';
//   type: 'residential';
//   place_rank: 26;
//   importance: 0.10000999999999993;
//   addresstype: 'road';
//   name: 'Calle Edison';
//   display_name: 'Calle Edison, El Polígono, Urbanización Puerto Estepona (Seghers), Estepona, Costa del Sol Occidental, // Málaga, Andalucía, 29680, España';
//   address: {
//     borough: 'Teatinos-Universidad';
//     city: 'Málaga';
//     neighbourhood: 'Hacienda Bizcochero';
//
//     road: 'Calle Edison';
//     industrial: 'El Polígono';
//     suburb: 'Urbanización Puerto Estepona (Seghers)';
//     town: 'Estepona';
//     county: 'Costa del Sol Occidental';
//     state_district: 'Málaga';
//     'ISO3166-2-lvl6': 'ES-MA';
//     state: 'Andalucía';
//     'ISO3166-2-lvl4': 'ES-AN';
//     postcode: '29680';
//     country: 'España';
//     country_code: 'es';
//   };
//   boundingbox: ['36.4277796', '36.4313213', '-5.1715457', '-5.1708436'];
// };
//
// type Municipio = {
//   IDMunicipio: '4505';
//   IDProvincia: '29';
//   IDCCAA: '01';
//   Municipio: 'Estepona'; // "Málaga",
//   Provincia: 'MÁLAGA';
//   CCAA: 'Andalucia';
// };
//
// type Provincia = {
//   IDPovincia: '29';
//   IDCCAA: '01';
//   Provincia: 'MÁLAGA';
//   CCAA: 'Andalucia';
// };
//
// type Estacion = {
//   'C.P.': '29680';
//   Dirección: 'CALLE GRAHAM BELL, 13';
//   Horario: 'L-D: 24H';
//   Latitud: '36,429667';
//   Localidad: 'ESTEPONA';
//   'Longitud (WGS84)': '-5,171306';
//   Margen: 'D';
//   Municipio: 'Estepona';
//   'Precio Biodiesel': '';
//   'Precio Bioetanol': '';
//   'Precio Gas Natural Comprimido': '';
//   'Precio Gas Natural Licuado': '';
//   'Precio Gases licuados del petróleo': '';
//   'Precio Gasoleo A': '1,429';
//   'Precio Gasoleo B': '';
//   'Precio Gasoleo Premium': '1,449';
//   'Precio Gasolina 95 E10': '';
//   'Precio Gasolina 95 E5': '1,529';
//   'Precio Gasolina 95 E5 Premium': '';
//   'Precio Gasolina 98 E10': '';
//   'Precio Gasolina 98 E5': '';
//   'Precio Hidrogeno': '';
//   Provincia: 'MÁLAGA';
//   Remisión: 'dm';
//   Rótulo: 'BALLENOIL';
//   'Tipo Venta': 'P';
//   '% BioEtanol': '0,0';
//   '% Éster metílico': '0,0';
//   IDEESS: '14843';
//   IDMunicipio: '4505';
//   IDProvincia: '29';
//   IDCCAA: '01';
// };
//
// type CarburantesResponse = {
//   Fecha: '06/02/2024 11:32:05';
//   ListaEESSPrecio: Estacion[];
//   Nota: 'Archivo de todos los productos en todas las estaciones de servicio. La actualización de precios se realiza cada // media hora, con los precios en vigor en ese momento.';
//   ResultadoConsulta: 'OK';
// };

const NO_ICON = 'https://cdn-icons-png.flaticon.com/512/2933/2933939.png';

const getItem = (key) => JSON.parse(localStorage.getItem(key));
const setItem = (key, value) =>
  localStorage.setItem(key, JSON.stringify(value));

const getLocation = async (latitude, longitude) => {
  const location = await wretch('https://nominatim.openstreetmap.org/reverse')
    .addon(QueryStringAddon)
    .query({ format: 'json', lat: latitude, lon: longitude })
    .get()
    .json();

  return location;
};

const BASE_URL =
  'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes';

const getProvincias = async () => {
  const municipios = await wretch(BASE_URL + '/Listados/Provincias')
    .get()
    .json();

  return municipios;
};

const getMunicipios = async () => {
  const municipios = await wretch(BASE_URL + '/Listados/Municipios')
    .get()
    .json();

  return municipios;
};

const getEstacionesPorProvincia = async (IDProvincia) => {
  const estaciones = await wretch(
    BASE_URL + '/EstacionesTerrestres/FiltroProvincia/' + IDProvincia
  )
    .get()
    .json();

  return estaciones.ListaEESSPrecio;
};

const getEstacionesPorMunicipio = async (IDMunicipio) => {
  const estaciones = await wretch(
    BASE_URL + '/EstacionesTerrestres/FiltroMunicipio/' + IDMunicipio
  )
    .get()
    .json();

  return estaciones.ListaEESSPrecio;
};

const filterEstacionesPorPrecioCombustible = (estaciones, combustibles) =>
  estaciones.filter((estacion) =>
    combustibles.some((combustible) =>
      estacion[combustible.combustible]
        ? between(
            parsePrice(estacion[combustible.combustible]),
            combustible.min,
            combustible.max
          )
        : false
    )
  );

const parsePrice = (price) => +price.replace(',', '.');

const getCoords = (estacion) => ({
  lat: +estacion['Latitud'].replaceAll(',', '.'),
  lng: +estacion['Longitud (WGS84)'].replaceAll(',', '.'),
});

const getURL = (estacion) => {
  return `https://maps.google.com/?q=${estacion._lat},${estacion._lng}`;
};

const formatDistance = (distance) => {
  if (distance < 1) return 'A ' + Math.floor(distance * 1000) + ' metros';
  return 'A ' + distance.toFixed(1) + ' kilometros';
};

const litrosRepostados = (precioLitro, distanciaKm, importe, avg) => {
  const consumo = avg / 100;
  return importe / precioLitro - consumo * distanciaKm;
};

const handleEstaciones = (estaciones, geolocation, combustibleKey, importe) => {
  const combustible = COMBUSTIBLES.find(
    (option) => option.key === combustibleKey
  );

  const mas = {
    cercana: null,
    barata: null,
    mejor: null,
  };

  estaciones.forEach((estacion) => {
    estacion._icon = NO_ICON;
    estacion._price = null;
    estacion._litros = null;
    estacion._mas_cercana = null;
    estacion._mas_barata = null;
    estacion._la_mejor = null;

    const gasolinera = GASOLINERAS.find((gasolinera) =>
      estacion['Rótulo'].includes(gasolinera.key)
    );

    if (gasolinera) estacion._icon = gasolinera.icon;

    if (geolocation.timestamp) {
      const coords = getCoords(estacion);

      estacion._lat = coords.lat;
      estacion._lng = coords.lng;

      estacion._distance = distanceInKmBetweenEarthCoordinates(
        geolocation.latitude,
        geolocation.longitude,
        coords.lat,
        coords.lng
      );

      if (!mas.cercana) mas.cercana = estacion;
      if (estacion._distance < mas.cercana._distance) mas.cercana = estacion;
    }

    if (estacion[combustibleKey]) {
      estacion._price = parsePrice(estacion[combustibleKey]);

      if (!mas.barata) mas.barata = estacion;
      if (estacion._price < mas.barata._price) mas.barata = estacion;
    }

    if (estacion._price && estacion._distance) {
      estacion._litros = litrosRepostados(
        estacion._price,
        estacion._distance,
        importe,
        combustible.avg
      );
      if (!mas.mejor) mas.mejor = estacion;
      if (estacion._litros > mas.mejor._litros) mas.mejor = estacion;
    }
  });

  if (mas.cercana) mas.cercana._mas_cercana = true;
  if (mas.barata) mas.barata._mas_barata = true;
  if (mas.mejor) mas.mejor._la_mejor = true;

  return estaciones;
};

const sortEstaciones = (estaciones, by, direction) => {
  estaciones.sort((a, b) => {
    if (!a[by]) return 1;
    if (!b[by]) return -1;
    return direction === 'ASC' ? a[by] - b[by] : b[by] - a[by];
  });

  return estaciones;
};

const orderByOptions = [
  { label: 'Precio', value: '_price' },
  { label: 'Distancia', value: '_distance' },
];

const filters = {
  combustible: getItem('@combustible') || head(COMBUSTIBLES).key,
  importe: getItem('@importe') || 30,
  orderBy: head(orderByOptions).value,
  direction: 'ASC',
};

const ListaEstaciones = ({ className, estaciones }) => {
  return (
    <Box className={className}>
      {estaciones.map((estacion) => {
        return (
          <Card key={estacion['IDEESS']} className="mb-3">
            <CardBody className="flex flex-col gap-2">
              <Box className="flex items-center gap-5">
                {estacion._icon && (
                  <Image className="w-12" src={estacion._icon} />
                )}
                <Box className="grow flex flex-col gap-2">
                  <Box className="flex justify-between">
                    <Text>{estacion['Rótulo']}</Text>
                    <Box className="flex gap-2 flex-wrap justify-end">
                      {estacion._la_mejor && (
                        <Chip color="warning">La mejor</Chip>
                      )}

                      {estacion._mas_barata && (
                        <Chip color="primary">La + barata</Chip>
                      )}

                      {estacion._mas_cercana && (
                        <Chip color="primary">La + cercana</Chip>
                      )}
                    </Box>
                  </Box>

                  <Box className="flex gap-2 flex-wrap">
                    {COMBUSTIBLES.map((combustible) => {
                      const value = estacion[combustible.key];
                      if (!value) return;

                      const focusIt = combustible.key === filters.combustible;

                      return (
                        <Chip
                          key={combustible.key}
                          color={focusIt ? 'primary' : 'default'}
                          variant={focusIt ? 'solid' : 'bordered'}
                        >
                          {combustible.abbr}: {value}
                        </Chip>
                      );
                    })}
                  </Box>

                  {estacion._distance && (
                    <Box>
                      <Text>{formatDistance(estacion._distance)}</Text>
                    </Box>
                  )}
                </Box>
              </Box>

              <Button onClick={() => window.open(getURL(estacion))}>
                Navegar
              </Button>
            </CardBody>
          </Card>
        );
      })}
    </Box>
  );
};

export const App = () => {
  const geolocation = useGeolocation();

  const [municipios, setMunicipios] = useState([]);
  const [Municipio, setMunicipio] = useState({});
  const [estaciones, setEstaciones] = useState([]);

  const fetchEstaciones = async (Municipio) => {
    setMunicipio(Municipio);

    const estaciones = await getEstacionesPorMunicipio(Municipio.IDMunicipio);

    handleEstaciones(
      estaciones,
      geolocation,
      filters.combustible,
      filters.importe
    );

    sortEstaciones(estaciones, filters.orderBy, filters.direction);

    setEstaciones(estaciones);
  };

  //const resultados = sortEstacionesPorCombustible(
  //  // filterEstacionesPorCombustible(estaciones, ["Precio Gases licuados del petróleo"]),
  //  filterEstacionesPorPrecioCombustible(estaciones, [
  //    { combustible: 'Precio Gasoleo Premium', min: 0, max: 5 },
  //    { combustible: 'Precio Gases licuados del petróleo', min: 0, max: 5 },
  //  ]),
  //  'Precio Gasoleo Premium'
  //);

  const onChangeCombustible = (option) => {
    filters.combustible = option.key;
    setItem('@combustible', filters.combustible);
    setEstaciones((prev) => {
      handleEstaciones(prev, geolocation, filters.combustible, filters.importe);
      sortEstaciones(prev, filters.orderBy, filters.direction);
      return [...prev];
    });
  };

  const changeImporte = (value) => {
    filters.importe = +value;
    setItem('@importe', filters.importe);
    setEstaciones((prev) => {
      handleEstaciones(prev, geolocation, filters.combustible, filters.importe);
      sortEstaciones(prev, filters.orderBy, filters.direction);
      return [...prev];
    });
  };

  const onChangeOrderBy = (option) => {
    filters.orderBy = option.value;
    setEstaciones((prev) =>
      sortEstaciones([...prev], filters.orderBy, filters.direction)
    );
  };

  useEffect(() => {
    const init = async () => {
      const municipios = await getMunicipios();

      setMunicipios(
        municipios.sort((a, b) => (a.Municipio > b.Municipio ? 1 : -1))
      );
    };
    init();
  }, []);

  useEffect(() => {
    console.log('geolocation', geolocation);

    if (geolocation.error) return;

    const fn = async () => {
      const location = await getLocation(
        geolocation.latitude,
        geolocation.longitude
      );

      console.log('location', location);

      const municipio = municipios.find((municipio) => {
        const Municipio =
          location.address.village ||
          location.address.town ||
          location.address.city;

        return municipio ? Municipio === municipio.Municipio : false;
      });

      console.log('municipio', municipio);

      if (!municipio) return;

      if (municipio.IDMunicipio === Municipio.IDMunicipio) return;

      fetchEstaciones(municipio);
    };
    fn();
  }, [geolocation]);

  if (geolocation.loading)
    return (
      <View className="flex justify-center items-center">
        <Loading />
      </View>
    );

  return (
    <View className="p-4 flex flex-col sm:flex-row gap-3 sm:justify-center">
      <Box>
        <Box className="mb-3">
          <Text>{language('town')}:</Text>
          <Select
            className="mt-2"
            getOptionLabel={(option) => option.Municipio}
            getOptionValue={(option) => option.IDMunicipio}
            options={municipios}
            value={Municipio}
            onChange={fetchEstaciones}
          />
        </Box>

        <Box className="mb-3">
          <Text>{language('fuel')}:</Text>
          <Select
            className="mt-2"
            getOptionLabel={(option) => option.abbr}
            getOptionValue={(option) => option.key}
            options={COMBUSTIBLES}
            value={COMBUSTIBLES.find(
              (option) => option.key === filters.combustible
            )}
            onChange={onChangeCombustible}
          />
        </Box>

        <Box className="mb-3">
          <Text>{language('amount')}:</Text>
          <NumberInput
            className="mt-2"
            min={5}
            step={5}
            isDisabled={!geolocation.timestamp}
            value={filters.importe}
            onChange={changeImporte}
          />
        </Box>

        <Box className="mb-3">
          <Text>{language('order')}:</Text>
          <Select
            className="mt-2"
            isOptionDisabled={(option) =>
              geolocation.timestamp ? false : option.value === '_distance'
            }
            options={orderByOptions}
            value={orderByOptions.find(
              (option) => option.value === filters.orderBy
            )}
            onChange={onChangeOrderBy}
          />
        </Box>
      </Box>

      <Box>
        <Box className="flex justify-between">
          <Text>{language('stations')}</Text>
          {!!estaciones.length && <Text>{estaciones.length} resultados</Text>}
        </Box>

        <Box className="mt-2">
          {!!estaciones.length ? (
            <ListaEstaciones estaciones={estaciones} />
          ) : (
            <Card>
              <CardBody>
                {Municipio ? (
                  <Text>No hay estaciones en esta zona.</Text>
                ) : (
                  <Text>Debe seleccionar un municipio primero.</Text>
                )}
              </CardBody>
            </Card>
          )}
        </Box>
      </Box>
    </View>
  );
};

export default App;
