
function keyMod11(keyNfe) {
  var base = 9;
  var result = 0;
  var sum = 0;
  var factor = 2;
  var numbers = [];
  var partial = [];

  for (var i = keyNfe.length; i > 0; i--) {
    numbers[i] = keyNfe.substr(i - 1, 1);
    partial[i] = numbers[i] * factor;
    sum += partial[i];
    if (factor === base) {
      factor = 1;
    }

    factor++;
  }

  if (result === 0) {
    sum *= 10;
    var digit = sum % 11;
    if (digit === 10) {
      digit = 0;
    }

    return digit;
  } else if (result === 1) {
    var rest = sum % 11;
    return rest;
  }
}

function checkDV(keyNfe) {
  return (keyMod11(keyNfe.slice(0, -1)) === keyNfe.split('').pop());
}

function checkSize(keyNfe) {
  return /\d{44}/.test(keyNfe);
}

function validateNfe(keyNfe) {
  if (!checkDV(keyNfe))
    return 'Chave de Acesso ' + keyNfe + ' não é valida';
  if (!checkSize(keyNfe))
    return 'Tamanho do Chave de Acesso ' + keyNfe +
            ' não é igual a 44 dígitos.';
  return 'OK';
}

module.exports = validateNfe;

// TODO SEFAZ RS Validator
// function validaChaveAcesso (chaveAcesso) {
//
//       var debug = '';
//
//       // Vazia
//       if (chaveAcesso == '')
          // { alert('Digite uma Chave de Acesso'); return false };
//
//       // Numérica
//       if (isNaN(chaveAcesso))
          // { alert('Chave de Acesso não numérica!'); return false; }
//
//       // Tamanho (44 posições)
//       if (chaveAcesso.length != 44) {
        //   alert('Chave de Acesso inválida (menos do que 44 posições)'); 
        //   return false;
        // }
//
//       var vNumero, vFaixa, vTamanho, vDigito, resultado, uf, ufAux;
//       vDigito = chaveAcesso.substr(43, 1); uf = chaveAcesso.substr(0, 2);
//
//       // Dígito Verificador (DV) da NF-e
//       vNumero = chaveAcesso; vFaixa = 9; vTamanho = 43;
//       var i, j, k, soma, resto; soma = 0; j = 2; k = vTamanho - vFaixa + 1;
//       for (var i = (vTamanho - 1); i >= k; i--) { soma = soma + (parseInt(vNumero.substr(i, 1)) * j); j = j + 1; }
//       j = 2; for (var i = (k - 1); i >= 0; i--) { soma = soma + (parseInt(vNumero.substr(i, 1)) * j); j = j + 1; if (j > vFaixa) j = 2; } resto = soma % 11;
//       if (resto < 2) { resultado = 0; } else { resultado = 11 - resto; }
//       if (resultado != vDigito) { alert('Chave de Acesso inválida (dígito de controle)'); return false; }
//
//       // UF
//       var listaUF = new Array (11,12,13,14,15,16,17,21,22,23,24,25,26,27,28,29,31,32,33,35,41,42,43,50,51,52,53); var ufValida = false;
//       for (ufAux in listaUF) { if (parseInt(listaUF[ufAux]) == parseInt(uf)) { ufValida = true; break; } }
//       if (!ufValida) { alert('Chave de Acesso inválida (código de UF)'); return false; }
//
//       // Data de Emissão
//       // - mês de emissão deve ser entre [1..12]
//       // - ano/mês de emissão deve ser posterior ou igual a 2006/09 e inferior ou igual ao atual (p.ex. 2011/05)
//       var uf = chaveAcesso.substring(0,2);
//       var ano = chaveAcesso.substring(2,4);
//       var mes = chaveAcesso.substring(4,6);
//       var cmes = new Date().getMonth() + 1;
//       var cano = new Date().getFullYear().toString().slice(2);
//
//       if ((mes == 0) || (mes > 12))       { alert("Chave de Acesso inválida (Data de emissão)"); return false; } // mês inválido
//       if ((ano <= 6) && (mes < 9))        { alert("Chave de Acesso inválida (Data de emissão)"); return false; } // antes de Oct/06
//
//       if ((ano > cano))                   { alert("Chave de Acesso inválida (Data de emissão)"); return false; } // ano da NF-e no futuro
//       if ((ano >= cano) && (mes > cmes))  { alert("Chave de Acesso inválida (Data de emissão)"); return false; } // ano válido, mês no futuro
//
//       // CNPJ zerado
//       var cnpj = chaveAcesso.substring(6,20); if (cnpj == 0) { alert('Chave de Acesso inválida (CNPJ)'); return false; } // cnpj zerado
//
//       // DV (dígito verificador) do CNPJ inválido
//       cnpj = cnpj.replace(".","").replace(".","").replace("-","").replace("/","");
//       var a = []; var b = new Number; var c = [6,5,4,3,2,9,8,7,6,5,4,3,2]; for (i=0; i<12; i++) { a[i] = cnpj.charAt(i); b += a[i] * c[i+1]; }
//       if ((x = b % 11) < 2) { a[12] = 0; } else { a[12] = 11-x; } b = 0; for (y=0; y<13; y++) { b += (a[y] * c[y]); }
//       if ((x = b % 11) < 2) { a[13] = 0; } else { a[13] = 11-x; }
//       if ((cnpj.charAt(12) != a[12]) || (cnpj.charAt(13) != a[13]))
//                                           { alert("Chave de Acesso inválida (CNPJ)"); return false; } // DV inválido
//       // Modelo da NF-e
//       var modelo = chaveAcesso.substring(20,22);
//       if (modelo != 55 && modelo != 65)                   { alert("Chave de Acesso inválida (Modelo)"); return false; } // modelo deve ser 55 ou 65
//
//       // Número da NF-e, deve ser diferente de 0
//       var numero = chaveAcesso.substring(24,34);
//       if (numero == 0)                    { alert("Chave de Acesso inválida (Número)"); return false; } // número da NF-e zerado
//
//       return true;
//   }
