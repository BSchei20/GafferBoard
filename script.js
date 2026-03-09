function applyTactics() {
    const formation = document.getElementById('formationSelect').value;
    if (!formation) return;

    // Traffic Controller: Checks which "folder" the formation is in
    let size = "11v11"; 
    if (["3-2-3", "3-4-1-flat"].includes(formation)) size = "9v9";
    if (["2-2-1", "2-3-1"].includes(formation)) size = "6v6";

    const redMap = tacticalMaps[size][formation][currentPhase];
    const blueMap = tacticalMaps[size][formation]['defense'];
    const w = field.clientWidth, h = field.clientHeight;

    for (let n = 1; n <= 11; n++) {
        // If the player exists in this formation (e.g., only 1-6 for 6v6)
        if (redMap && redMap[n]) {
            redTeam[n].style.display = 'flex';
            blueTeam[n].style.display = 'flex';
            redTeam[n].style.left = (redMap[n][0] * w - 19) + 'px';
            redTeam[n].style.top = (redMap[n][1] * h - 19) + 'px';
            
            // Blue team is mirrored automatically
            blueTeam[n].style.left = ((1 - blueMap[n][0]) * w - 19) + 'px';
            blueTeam[n].style.top = ((1 - blueMap[n][1]) * h - 19) + 'px';
        } else {
            // Hide the extra players for smaller game sizes
            redTeam[n].style.display = 'none';
            blueTeam[n].style.display = 'none';
        }
    }
}
