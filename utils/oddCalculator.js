exports.calculate = (nivel1, nivel2) => {

        const diff = Math.abs(nivel1 - nivel2);

        const tabelaOdds = {
            0: { v1: 3.0, v2: 3.0, emp: 4.0 },
            1: { v1: 4.0, v2: 2.0, emp: 3.0 },
            2: { v1: 5.0, v2: 1.5, emp: 4.0 },
            3: { v1: 5.0, v2: 1.5, emp: 6.0 },
            4: { v1: 6.0, v2: 1.3, emp: 7.0 }
        }
        
        return tabelaOdds[diff] ?? tabelaOdds[4];
    }