


async function onclickDDLPlantUML() {
    const content = `
        <article>
            <section id="section_conversion">
                <div class="section_div_conversion_grid">
                    <div class="section_div_conversion_grid_item" id="section_div_conversion_grid_item_DDL">
                        <label for="DDL">DDL</label> <br>
                        <textarea name="DDL" id="DDL" cols="130" rows="10"></textarea> <br>
                        <button type="button" onclick="openFile()">Load DDL</button>
                        <input id="inputFile" type='file' accept=".ddl, .sql, .txt" style="display: none;" onchange="readFile(event)" />

                        <button type="button" onclick="openExcelFile()">Open Excel</button>
                        <input id="inputExcelFile" type='file' accept=".csv, .txt" style="display: none;" onchange="readExcelFile(event)" />
                    </div>
                    <div class="section_div_conversion_grid_item" id="section_div_conversion_grid_item_space">
                        <div id="div_button_generate" onclick="generateDiagram()">
                            <img src="img/arrow.png" alt="generate arrow" width="50px">
                        </div>
                    </div>
                    <div class="section_div_conversion_grid_item" id="section_div_conversion_grid_item_UML">
                        <label for="UML">PlantUML</label> <br>
                        <textarea name="UML" id="UML" cols="130" rows="10"></textarea> <br>
                        <button type="button" onclick="downloadUML()">Save UML</button>
                    </div>
                </div>
            </section>
            <section id="section_diagram">
                <div class="section_div_diagram">
                    <iframe id="iframe_diagram" src="" frameborder="0"></iframe>
                </div>
            </section>
        </article>
        `;

    document.getElementById('main').innerHTML = content;
}