const getDiff = require("recursive-diff").getDiff;

const a = {
  Pessoa: {
    Nome: "Danilo",
    SobreNome: "Ribeiro Silveira",
    Endereco: {
      Rua: "Lavras",
      Numero: 245,
      Bairro: "Umuarama",
      Caracteristicas: [
        { Nome: "Piscina", valor: 333 },
        { Nome: "Varanda", valor: 333, teste: { a: 9, b: 2 } },
      ],
    },
  },
  Age: 39,
  Skils: [
    { Type: "NodeJS", Value: 10 },
    { Type: "AngularJS", Value: 10 },
    { Type: "ReactJS", Value: 10 },
  ],
};
const b = {
  Pessoa: {
    Nome: "Danilo",
    SobreNome: "Ribeiro Silveira",
    Endereco: {
      Rua: "Lavras",
      Numero: 245,
      Bairro: "Umuarama",
      Caracteristicas: [
        { Nome: "Piscina", valor: 333 },
        { Nome: "Varanda", valor: 333, teste: { a: 9, b: 2 } },
      ],
    },
  },
  Age: 39,
  Skils: [
    { Type: "NodeJS", Value: 10 },
    { Type: "AngularJS", Value: 10 },
    { Type: "ReactJS", Value: 10 },
  ],
};

const diff = getDiff(a, b, true);
//console.log(JSON.stringify(diff, null, 2));
//console.table(diff);

const finalResult = diff.reduce((acc, item) => {
  const GetAuditoria = (p) => ({
    Prop: (p.path || []).join("."),
    Old: p.oldVal,
    New: p.val,
  });

  const GetAuditoriaObjeto = (registro, dados) => {
    let itens = [];

    Object.keys(
      registro.op === "delete" ? registro.oldVal : registro.val
    ).forEach((key) => {
      const data = {
        op: registro.op,
        path: [...(registro.path || ""), key],
        oldVal: registro.op === "delete" ? registro.oldVal[key] : undefined,
        val: registro.op === "delete" ? undefined : registro.val[key],
      };

      if (
        (registro.op === "add" && typeof registro.val[key] === "object") ||
        (registro.op === "delete" && typeof registro.oldVal[key] === "object")
      ) {
        itens = [...itens, ...GetAuditoriaObjeto(data, dados)];
      } else {
        itens.push(GetAuditoria(data));
      }
    });

    return [...dados, ...itens];
  };

  if (
    (item.op === "add" && typeof item.val === "object") ||
    (item.op === "delete" && typeof item.oldVal === "object")
  ) {
    const dadosObj = GetAuditoriaObjeto(item, []);
    return [...acc, ...dadosObj];
  }

  return [...acc, GetAuditoria(item)];
}, []);

//console.log(JSON.stringify(finlResult, null, 2));
console.table(finalResult);
