

export default function LocalizacaoUsuario() {

  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject('Geolocalizacao nao suportada pelo navegador.');
    }

    navigator.geolocation.getCurrentPosition(
      (posicao) =>
        resolve({
          latitude: posicao.coords.latitude,
          longitude: posicao.coords.longitude,
        })
      ,
      (erroObjeto) => {
        switch (erroObjeto.code) {
          case erroObjeto.PERMISSION_DENIED:
            reject('Usuário rejeitou a solicitação de localização.');
            break;
          case erroObjeto.POSITION_UNAVAILABLE:
            reject('A localização não está disponível.');
            break;
          case erroObjeto.TIMEOUT:
            reject('A requisição expirou.');
            break;
          default:
            reject('Ocorreu um erro desconhecido.');
        }
      }
    );
  })
}

