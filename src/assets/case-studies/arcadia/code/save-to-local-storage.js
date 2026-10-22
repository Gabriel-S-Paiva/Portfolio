    saveToLocalStorage(player) {
        const counts = player.getResiduoCounts();
        localStorage.setItem('residuos_papel', counts.papel.toString());
        localStorage.setItem('residuos_vidro', counts.vidro.toString());
        localStorage.setItem('residuos_plastico', counts.plastico.toString());
        localStorage.setItem('residuos_lixo', counts.lixo.toString());
        
        return counts;
    }
