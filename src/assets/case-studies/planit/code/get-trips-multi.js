  // 1. Obter todosos Voos
  const segmentos = [];
  for (let i = 0; i < destinos.length - 1; i++) {
    const origem = destinos[i];
    const destino = destinos[i + 1];
    const voos = viagens.filter(
      (v) =>
        v.origem === origem &&
        v.destino === destino &&
        Object.entries(filtrosSemDatas).every(
          ([key, value]) =>
            v[key] !== undefined &&
            (Array.isArray(value) ? value.includes(v[key]) : v[key] == value)
        )
    );
    if (voos.length === 0) return []; // Not dound
    segmentos.push(voos);
  }
  // 3. Filtrar por datas
  const rotas = combinar(segmentos)
    .filter((segmentos) => {
      // Restrições da Datas
      for (let i = 0; i < segmentos.length; i++) {
        const voo = segmentos[i];
        // 1º voo: partida >= dataPartidaMin (se definida)
        if (i === 0 && dataPartidaMin) {
          if (new Date(voo.partida) < new Date(dataPartidaMin)) return false;
        }
        // Último voo: chegada <= dataChegadaMax (se definida)
        if (i === segmentos.length - 1 && dataChegadaMax) {
          if (new Date(voo.chegada) > new Date(dataChegadaMax)) return false;
        }
        // Voos: partida >= chegada do voo anterior
        if (i > 0) {
          const chegadaAnterior = new Date(segmentos[i - 1].chegada);
          const partidaAtual = new Date(voo.partida);
          if (partidaAtual < chegadaAnterior) return false;
        }
      }
      // Se circular, o último destino deve ser igual ao primeiro
      if (circular && segmentos.length > 0) {
        if (segmentos[segmentos.length - 1].destino !== destinos[0])
          return false;
      }
      return true;
    })
    .map((segmentos) => ({ viagens: segmentos }));
