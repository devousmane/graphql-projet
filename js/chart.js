// Importez fetchXpByProject depuis votre fichier fetchUser.js
import { fetchXpByProject, fetchUserGroups } from "./fetchUser.js";

export async function generateBarChartSVG(jwt) {
    try {
        const transactions = await fetchXpByProject(jwt);
        const labels = transactions.map(transaction => transaction.path.replace("/dakar/div-01/", ""));
        const data = transactions.map(transaction => transaction.amount / 1000);

        const svgWidth = 600;
        const svgHeight = 600;  // Augmenté pour le titre en dessous
        const margin = { top: 20, right: 20, bottom: 200, left: 50 }; // Augmenté bottom pour le titre
        const chartWidth = svgWidth - margin.left - margin.right;
        const chartHeight = svgHeight - margin.top - margin.bottom;

        const svg = d3.create("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight);

        const maxValue = Math.max(...data);
        const yScale = d3.scaleLinear()
            .domain([0, maxValue])
            .range([chartHeight, 0]);

        const xScale = d3.scaleBand()
            .domain(labels)
            .range([0, chartWidth])
            .padding(0.1);

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        g.selectAll('rect')
            .data(data)
            .enter().append('rect')
            .attr('x', (d, i) => xScale(labels[i]))
            .attr('y', d => yScale(d))
            .attr('width', xScale.bandwidth())
            .attr('height', d => chartHeight - yScale(d))
            .attr('fill', 'steelblue')
            .attr('rx', 5); // Bord arrondi

        g.append('g')
            .attr('transform', `translate(0,${chartHeight})`)
            .call(d3.axisBottom(xScale))
            .selectAll('text')
            .style('text-anchor', 'end')
            .attr('dx', '-0.8em')
            .attr('dy', '0.15em')
            .attr('transform', 'rotate(-65)');

        g.append('g')
            .call(d3.axisLeft(yScale));

        // Ajout du titre sous le diagramme
        svg.append('text')
            .attr('x', svgWidth / 2)
            .attr('y', svgHeight - margin.bottom / 2+ 50)  // Positionné sous le graphique
            .attr('text-anchor', 'middle')
            .style('font-size', '16px')
            .style('font-weight', 'bold')
            .text('XP Earned by the Project');

        const svgString = new XMLSerializer().serializeToString(svg.node());
        return svgString;

    } catch (error) {
        console.error('Une erreur est survenue lors de la génération du diagramme en barre SVG :', error);
    }
}



export async function createRadarChart(jwtToken) {
    try {
        const userLoginCountMap = await fetchUserGroups(jwtToken);
        if (!userLoginCountMap) {
            console.error('No data returned from fetchUserGroups');
            return;
        }

        // Dimensions et marges du graphique
        const width = 450, height = 450;
        const margin = { top: 50, right: 50, bottom: 50, left: 50 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
        const radius = Math.min(innerWidth, innerHeight) / 2;

        // Création de l'élément SVG
        const svg = d3.select("#radarChart").html("").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);

        // Données pour le graphique
        const labels = Array.from(userLoginCountMap.keys());
        const values = Array.from(userLoginCountMap.values());
        const maxValue = Math.max(...values, 1); // Assurez-vous d'avoir un maximum significatif

        // Échelle de l'angle
        const angleScale = d3.scaleLinear()
            .domain([0, labels.length])
            .range([0, 2 * Math.PI]);

        // Échelle radiale
        const radiusScale = d3.scaleLinear()
            .domain([0, maxValue])
            .range([0, radius]);

        // Construction du radar
        const line = d3.lineRadial()
            .angle((d, i) => angleScale(i) - Math.PI / 2) // Ajuster pour démarrer du haut
            .radius(d => radiusScale(d));

        // Ajout des axes
        labels.forEach((label, i) => {
            const angle = angleScale(i) - Math.PI / 2; // Aligner correctement les axes
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            svg.append("line")
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", x)
                .attr("y2", y)
                .style("stroke", "black")
                .style("stroke-width", 1);

            svg.append("text")
                .attr("x", x * 1.1)
                .attr("y", y * 1.1)
                .text(label)
                .style("text-anchor", "middle")
                .style("alignment-baseline", "middle")
                .style("font-size", "12px");
        });

        // Ajout de la forme radar
        svg.append("path")
            .datum(values)
            .attr("d", line)
            .style("fill", "rgba(255, 99, 132, 0.5)")
            .style("stroke", "black")
            .style("stroke-width", 2);

    } catch (error) {
        console.error('Error in createRadarChart:', error);
    }
}

export async function createPolarAreaChart(jwtToken) {
    try {
        const userLoginCountMap = await fetchUserGroups(jwtToken);
        if (!userLoginCountMap) {
            console.error('No data returned from fetchUserGroups');
            return;
        }

        // Trier les données par valeur décroissante et limiter à 10
        const entries = Array.from(userLoginCountMap.entries());
        const sortedEntries = entries.sort((a, b) => b[1] - a[1]).slice(0, 10);
        
        const labels = sortedEntries.map(entry => entry[0]);
        const values = sortedEntries.map(entry => entry[1]);
        const maxValue = Math.max(...values);

        // Dimensions et marges du graphique
        const width = 600, height = 650; // Augmenté la hauteur pour le titre
        const radius = Math.min(width, height - 50) / 2; // Ajuster le rayon pour l'espace du titre

        // Création de l'élément SVG
        const svg = d3.select("#polarAreaChart").html("").append("svg")
                      .attr("width", width)
                      .attr("height", height);

        const g = svg.append("g")
                     .attr("transform", `translate(${width / 2}, ${height / 2 - 25})`); // Centrage ajusté

        // Échelle angulaire
        const angleScale = d3.scaleBand()
                             .domain(labels)
                             .range([0, 2 * Math.PI])
                             .padding(0.1);

        // Échelle radiale
        const radiusScale = d3.scaleRadial()
                              .domain([0, maxValue])
                              .range([0, radius]);

        // Création des secteurs
        g.selectAll("path")
           .data(values)
           .enter()
           .append("path")
           .attr("d", d3.arc()
                        .innerRadius(0)
                        .outerRadius(d => radiusScale(d))
                        .startAngle((d, i) => angleScale(labels[i]))
                        .endAngle((d, i) => angleScale(labels[i]) + angleScale.bandwidth())
                        .padAngle(0.01)
                        .padRadius(0))
           .style("fill", (d, i) => d3.schemeCategory10[i % 10])
           .style("opacity", 0.8);

        // Ajout des légendes
        g.selectAll("text")
           .data(labels)
           .enter()
           .append("text")
           .attr("x", (d, i) => radiusScale(values[i]) * Math.cos(angleScale(labels[i]) + angleScale.bandwidth() / 2 - Math.PI / 2))
           .attr("y", (d, i) => radiusScale(values[i]) * Math.sin(angleScale(labels[i]) + angleScale.bandwidth() / 2 - Math.PI / 2))
           .text(d => d)
           .style("text-anchor", "middle")
           .style("font-size", "12px");

        // Ajout du titre en bas
        svg.append("text")
           .attr("x", width / 2)
           .attr("y", height - 100) // Position proche du bas du SVG
           .text("Top 10 of Users You Interacted With")
           .style("text-anchor", "middle")
           .style("font-size", "16px")
           .style("font-weight", "bold");

    } catch (error) {
        console.error('Error in createPolarAreaChart:', error);
    }
}

