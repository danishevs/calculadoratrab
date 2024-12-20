document.getElementById('calcularBtn').addEventListener('click', calcularVerbas);

function calcularVerbas() {
    const dataAdmissao = new Date(document.getElementById('dataAdmissao').value);
    const dataDemissao = new Date(document.getElementById('dataDemissao').value);
    const salarioBase = parseFloat(document.getElementById('salarioBase').value);
    const motivoDemissao = document.getElementById('motivoDemissao').value;
    const horasExtras50 = parseFloat(document.getElementById('horasExtras50').value) || 0;
    const horasExtras100 = parseFloat(document.getElementById('horasExtras100').value) || 0;
    const adicionalNoturnoHoras = parseFloat(document.getElementById('adicionalNoturno').value) || 0;
    const grauInsalubridade = parseInt(document.getElementById('insalubridade').value) || 0;
    const periculosidade = document.getElementById('periculosidade').value === 'sim';
    const feriasVencidas = document.getElementById('feriasVencidas').value === 'sim';
    const pagouMulta467E477 = document.getElementById('pagouMulta467E477').value === 'sim';

    let resultados = '';

    if (isNaN(dataAdmissao) || isNaN(dataDemissao) || isNaN(salarioBase)) {
        resultados = '<p>Preencha todos os campos corretamente.</p>';
    } else {
        const saldoSalario = calcularSaldoSalario(dataAdmissao, dataDemissao, salarioBase);
        const avisoPrevio = calcularAvisoPrevio(dataAdmissao, dataDemissao, motivoDemissao);
        const decimoTerceiro = calcularDecimoTerceiro(dataAdmissao, dataDemissao, salarioBase);
        const ferias = calcularFerias(dataAdmissao, dataDemissao, salarioBase, feriasVencidas);
        const horasExtras = calcularHorasExtras(salarioBase, horasExtras50, horasExtras100);
        const adicionalNoturno = calcularAdicionalNoturno(salarioBase, adicionalNoturnoHoras);
        const adicionalInsalubridade = calcularAdicionalInsalubridade(salarioBase, grauInsalubridade);
        const adicionalPericulosidade = calcularAdicionalPericulosidade(salarioBase, periculosidade);
        const fgts = calcularFGTS(salarioBase, decimoTerceiro, horasExtras, adicionalNoturno, adicionalInsalubridade, adicionalPericulosidade, motivoDemissao);
        const multa467 = calcularMulta467(saldoSalario, avisoPrevio, decimoTerceiro, ferias, horasExtras, adicionalNoturno, adicionalInsalubridade, adicionalPericulosidade, pagouMulta467E477);
        const multa477 = calcularMulta477(pagouMulta467E477, motivoDemissao, salarioBase);

        resultados += `<p>Saldo de Salário: R$ ${saldoSalario.toFixed(2)}</p>`;
        resultados += `<p>Aviso Prévio: ${avisoPrevio}</p>`;
        resultados += `<p>13º Salário Proporcional: R$ ${decimoTerceiro.toFixed(2)}</p>`;
        resultados += `<p>Férias (Proporcionais + Vencidas + 1/3): R$ ${ferias.toFixed(2)}</p>`;
        resultados += `<p>Horas Extras 50%: R$ ${horasExtras.valor50.toFixed(2)}</p>`;
        resultados += `<p>Horas Extras 100%: R$ ${horasExtras.valor100.toFixed(2)}</p>`;
        resultados += `<p>Adicional Noturno: R$ ${adicionalNoturno.toFixed(2)}</p>`;
        resultados += `<p>Adicional de Insalubridade: R$ ${adicionalInsalubridade.toFixed(2)}</p>`;
        resultados += `<p>Adicional de Periculosidade: R$ ${adicionalPericulosidade.toFixed(2)}</p>`;
        resultados += `<p>FGTS (8% Mensal): R$ ${fgts.fgtsMensal.toFixed(2)}</p>`;
        resultados += `<p>FGTS (Multa Rescisória): R$ ${fgts.multaRescisoria.toFixed(2)}</p>`;
        resultados += `<p>Multa Artigo 467 CLT: R$ ${multa467.toFixed(2)}</p>`;
        resultados += `<p>Multa Artigo 477 CLT: R$ ${multa477.toFixed(2)}</p>`;

    }

    document.getElementById('resultados').innerHTML = resultados;
}

function calcularSaldoSalario(dataAdmissao, dataDemissao, salarioBase) {
    const diasTrabalhados = dataDemissao.getDate();
    const saldoSalario = (salarioBase / 30) * diasTrabalhados;
    return saldoSalario;
}

function calcularAvisoPrevio(dataAdmissao, dataDemissao, motivoDemissao) {
    if (motivoDemissao === 'comJustaCausa' || motivoDemissao === 'pedidoDemissao') {
        return 'Não aplicável';
    }

    const tempoServico = dataDemissao.getFullYear() - dataAdmissao.getFullYear();
    let diasAvisoPrevio = 30;

    if (tempoServico > 0) {
        diasAvisoPrevio += tempoServico * 3; 
        if (diasAvisoPrevio > 90) {
            diasAvisoPrevio = 90;
        }
    }

    return `${diasAvisoPrevio} dias`;
}

function calcularDecimoTerceiro(dataAdmissao, dataDemissao, salarioBase) {
    const mesesTrabalhados = (dataDemissao.getMonth() - dataAdmissao.getMonth() + 12) % 12;
    const decimoTerceiro = (salarioBase / 12) * mesesTrabalhados;
    return decimoTerceiro;
}

function calcularFerias(dataAdmissao, dataDemissao, salarioBase, feriasVencidas) {
    const mesesTrabalhados = (dataDemissao.getMonth() - dataAdmissao.getMonth() + 12) % 12;
    let feriasProporcionais = (salarioBase / 12) * mesesTrabalhados;
    const tercoConstitucional = feriasProporcionais / 3;

    if (feriasVencidas === 'sim') {
        feriasProporcionais *= 2; // Dobra o valor em caso de férias vencidas
    }

    return feriasProporcionais + tercoConstitucional;
}

function calcularHorasExtras(salarioBase, horasExtras50, horasExtras100) {
    const valorHora = salarioBase / 220; // Considerando uma jornada mensal de 220 horas
    const valorHoraExtra50 = valorHora * 1.5;
    const valorHoraExtra100 = valorHora * 2;

    const valorTotalHorasExtras50 = valorHoraExtra50 * horasExtras50;
    const valorTotalHorasExtras100 = valorHoraExtra100 * horasExtras100;

    return {
        valor50: valorTotalHorasExtras50,
        valor100: valorTotalHorasExtras100
    };
}

function calcularAdicionalNoturno(salarioBase, adicionalNoturnoHoras) {
    const valorHora = salarioBase / 220;
    const adicionalNoturno = valorHora * 0.2; // Adicional de 20%
    return adicionalNoturno * adicionalNoturnoHoras;
}

function calcularAdicionalInsalubridade(salarioBase, grauInsalubridade) {
    const salarioMinimo = 1412; // Salário mínimo de 2024
    return salarioMinimo * (grauInsalubridade / 100);
}

function calcularAdicionalPericulosidade(salarioBase, periculosidade) {
    if (periculosidade) {
        return salarioBase * 0.3;
    }
    return 0;
}

function calcularFGTS(salarioBase, decimoTerceiro, horasExtras, adicionalNoturno, adicionalInsalubridade, adicionalPericulosidade, motivoDemissao) {
    const baseCalculoFGTS = salarioBase + decimoTerceiro + horasExtras.valor50 + horasExtras.valor100 + adicionalNoturno + adicionalInsalubridade + adicionalPericulosidade;
    const fgtsMensal = baseCalculoFGTS * 0.08;

    let multaRescisoria = 0;
    if (motivoDemissao === 'semJustaCausa') {
        multaRescisoria = fgtsMensal * 0.4; // Multa de 40% em caso de demissão sem justa causa
    }

    return {
        fgtsMensal: fgtsMensal,
        multaRescisoria: multaRescisoria
    };
}

function calcularMulta467(saldoSalario, avisoPrevio, decimoTerceiro, ferias, horasExtras, adicionalNoturno, adicionalInsalubridade, adicionalPericulosidade, pagouMulta467E477) {
    if(pagouMulta467E477 === 'sim'){
        return 0;
    }
    const verbasIncontroversas = saldoSalario + decimoTerceiro + ferias + horasExtras.valor50 + horasExtras.valor100 + adicionalNoturno + adicionalInsalubridade + adicionalPericulosidade;
    return verbasIncontroversas * 0.5; // Multa de 50% sobre as verbas incontroversas não pagas em primeira audiência
}

function calcularMulta477(pagouMulta467E477, motivoDemissao, salarioBase) {
    if (motivoDemissao === 'comJustaCausa' || pagouMulta467E477 === 'sim') {
        return 0;
    }

    return salarioBase; // Multa de um salário base por atraso no pagamento das verbas rescisórias
}