class Builder {
    editor = null;
    arrBlocks = {};
    strPageObjectName = '';
    strAssistentObjectName = 'assistant';

    arrBlocksTreated = []; // Array de blocos tratados

    objBlocksDefault = {}; // Blocos default definidos aqui no arquivo
    objBlocksField = {}; // Blocos com os campos do contato
    objBlocksUser = {}; // Blocos salvos pelo usuário
    objBlocksEmailUser = {}; // Blocos de e-mails salvos pelo usuário
    objBlocksPage = {}; // Blocos de páginas
    objBlocksFormsPlices = {}; // Formulários salvos na Plices
    objBlocksForm = {}; // Blocos exclusivos de formulários
    objBlocksEmail = {};// Blocos exclusivos de e-mails

    strBlockLayout = __('Layout');
    strBlockField = __('Blocos adicionais');
    strBlockModel = __('Meus blocos');
    strBlockText = __('Texto');
    strButton = __('Botões');
    strCard = __('Cartões');
    //strBlockMedia = __('Addons');

    constructor() {
        var $this = this;

        $this.editor = null;

        setTimeout(function () {
            $this.getBlocksDefault(); // Blocos default definidos aqui no arquivo
            $this.getBlocksField(); // Blocos com os campos do contato
            $this.getBlocksUser(); // Blocos salvos pelo usuário
            $this.getBlocksEmailUser(); // Blocos de e-mails salvos pelo usuário
            $this.getBlocksPage(); // Blocos de páginas
            $this.getBlocksFormsPlices(); // Formulários salvos na Plices
            $this.getBlocksForm(); // Blocos exclusivos de formulários
            $this.getBlocksEmail();// Blocos exclusivos de e-mails  
        }, 1000);
    }


    /**
     * Nome do objeto usado na página
     * 
     * @param {string} strPageObjectName 
     */
    setPageObjectName(strPageObjectName) {
        this.strPageObjectName = strPageObjectName;
    }

    /**
     * Nome do objeto usado na página
     * 
     * @param {string} strPageObjectName 
     */
    setAssistentObjectName(strAssistentObjectName) {
        this.strAssistentObjectName = strAssistentObjectName;
    }

    /**
     * Retorna o bloco selecionado
     * 
     * @returns string
     */
    getSelected() {
        var $this = this;
        if ($this.editor.getSelected() != undefined) {
            return $this.editor.getSelected().toHTML();
        }
        return '';
    }

    /**
     * Muda o conteúdo do editor
     * 
     * @param {string} strBody 
     */
    setBody(strBody) {
        var $this = this;
        $this.editor.setComponents(strBody);
    }

    /**
     * Muda o CSS do editor
     * 
     * @param {string} strStyle 
     */
    setStyle(strStyle) {
        var $this = this;
        $this.editor.setStyle(strStyle);
    }

    async start(strBody = null, strCss = null, intVariation = null) {

        var $this = this;
        $this.intVariation = intVariation;

        $this.initialize(intVariation).then(function () {
            if (strBody != null) {
                // Inicializa o conteúdo
                $this.editor.setComponents(strBody);
            }

            if (strCss != null) {
                // Inicializa o estilo
                $this.editor.setStyle(strCss);
            }

            setTimeout(function () {
                // Altera o comportamento do editor
                $this.behavior();
            }, 1000);

        });
    }

    hasChange(objProgram) {
        var $this = this;

        // Identifica mudança no conteúdo do formulário
        $this.editor.on('change', function () {
            if (objProgram.strHtml != $this.editor.getHtml() || objProgram.strStyle != $this.editor.getCss()) {

                objProgram.strHtml = $this.editor.getHtml();
                objProgram.strStyle = $this.editor.getCss();


                objProgram.booChanged = true;
                $((objProgram.strForm != undefined ? objProgram.strForm + " " : '') + ".send").attr("disabled", false);
            }

        });
    }

    hasChangeVariations(objProgram) {
        var $this = this;

        var intVersion = 1;
        if (objProgram.version != undefined) {
            // Verifica se editor tem mais de uma versão
            intVersion = objProgram.version;
        }

        if (typeof objProgram.strBody == 'undefined') {
            objProgram.strBody = [];
        }


        if (typeof objProgram.strStyle == 'undefined') {
            objProgram.strStyle = [];
        }

        // Identifica mudança no conteúdo do formulário
        console.log($this.editor);
        $this.editor.on('change', function () {

            if (objProgram.strBody[intVersion] != $this.editor.getHtml() || objProgram.strStyle[intVersion] != $this.editor.getCss()) {
                objProgram.strContent = $this.editor.getHtml();

                objProgram.strBody[intVersion] = $this.editor.getHtml();
                objProgram.strStyle[intVersion] = $this.editor.getCss();

                $('#body_' + intVersion).val($this.editor.getHtml());
                $('#style_' + intVersion).val($this.editor.getCss());

                if (objProgram.variations != undefined) {
                    // Trata as variações
                    $.each(objProgram.variations, function (index, variation) {
                        if (variation.number == intVersion) {
                            objProgram.variations[index].body = $this.editor.getHtml();
                            objProgram.variations[index].style = $this.editor.getCss();
                        }
                    });
                }


                objProgram.booChanged = true;
                $((objProgram.strForm != undefined ? objProgram.strForm + " " : '') + ".send").attr("disabled", false);
            }

        });
    }


    /* Funcçao teste */


    /**
     * Remove os blocos desnecessários
     */
    removeBlocks() {
        var $this = this;
        $.each(this.arrRemoveBlocks, function (index, strBlock) {
            $this.editor.BlockManager.remove(strBlock);
        });
    }

    /**
     * Monta os blocos principais
     */
    
    getBlocksDefault() {
        var $this = this;


        // COMEÇO BLOCOS MAIS USADOS 

        //Seção inicial
        $this.objBlocksDefault['section-ini'] = {
            label: 'Seção',
            category: $this.strBlockText,
            media: `<img src="/builder/svg/column-1.svg" class='icon-tools' style="width:45px">`,
            attributes: { class: '', title: "Adicione uma seção ao layout" },
            editable: true,
            draggable: true,
            selectable: true,
            resizable: true,
            content: `
                    <section style="width: 100%; font-family: sans-serif; height: 150px; display: flex; flex-direction: column; justify-content: center; align-items: center; box-sizing: border-box; padding: 10px;" data-gjs-resizable="true"></section>
                    `
        };

        // Headline com tag H1
        $this.objBlocksDefault['h1'] = {
            label: 'Headline',
            category: $this.strBlockText,
            media: `<img src="/builder/svg/h1.svg" class='icon-tools' style="width:45px">`,
            resizable: true,
            attributes: { class: '', title: "Adicione uma Headline" },
            traits: {
                type: 'number',
                // ...
                placeholder: '0-100',
                min: 0, // Minimum number value
                max: 100, // Maximum number value
                step: 5, // Number of steps
              },
            content:
              `   
                <h1 class="" data-bold="inherit" data-gramm="false" style="display:flex; justify-content:center; align-items:center; padding: 0; margin: 5px 5px 10px 5px; text-align: center; box-sizing: border-box;  font-size: 39px;width:100%;" data-gjs-resizable="true">
                  Headline 01
                </h1>
                `,
          };

        // Headline com tag H2
        $this.objBlocksDefault['h2'] = {
            label: 'Sub-Headline',
            category: $this.strBlockText,
            attributes: { class: '', title: "Adicione uma Sub-Headline" },
            media: `<img src="/builder/svg/h2.svg" class='icon-tools' style="width:45px">`,
            resizable: true,
            content:
                `
                    <h2 class="" data-bold="inherit" data-gramm="false" style="width:100%;display:flex; justify-content:center;align-items:center; padding:  0; margin: 5px 5px 10px 5px; text-align: center; box-sizing: border-box; font-size: 29px;" data-gjs-resizable="true">
                        Headline 02
                    </h2>
                    `,

        };


        // Conteúdo de texto
        $this.objBlocksDefault['p'] = {
            label: 'Texto',
            category: $this.strBlockText,
            attributes: { class: '', title: "Adicione um texto ou paragráfo" },
            media: `<img src="/builder/svg/text.svg" class='icon-tools' style="width:45px">`,
            resizable: true,
            content:
                `
                    <p style="width:100%;display:flex; justify-content:center;align-items:center;color:black;padding: 5px; margin 5px; text-align: center; box-sizing: border-box; font-size: 16px;" title="Para Colar um texto sem formatação utilize CTRL + SHIFT + Z, para colar o texto com a formatação original cole com CTRL + Z" data-gjs-resizable="true">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem dolore, alias, numquam enim ab voluptate id quam harum ducimus cupiditate similique quisquam et deserunt, recusandae.
                    </p>
                    `,

        };

        // Conteúdo para imagem simples
        $this.objBlocksDefault['image-01'] = {
            label: 'Imagem',
            category: $this.strBlockText,
            media: `<img src="/builder/svg/image.svg" class='icon-tools' style="width:45px">`,
            attributes: { class: '', title: "Adicione uma imagem ao layout" },
            resizable: true,
            content: `   <img width=100% height=auto style="box-sizing= border-box; max-width: 100%;" height=100% src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3R5bGU9ImZpbGw6IHJnYmEoMCwwLDAsMC4xNSk7IHRyYW5zZm9ybTogc2NhbGUoMC43NSkiPgogICAgICAgIDxwYXRoIGQ9Ik04LjUgMTMuNWwyLjUgMyAzLjUtNC41IDQuNSA2SDVtMTYgMVY1YTIgMiAwIDAgMC0yLTJINWMtMS4xIDAtMiAuOS0yIDJ2MTRjMCAxLjEuOSAyIDIgMmgxNGMxLjEgMCAyLS45IDItMnoiPjwvcGF0aD4KICAgICAgPC9zdmc+"/> `
        };

        //Botão padrão
        $this.objBlocksDefault['btn-plices'] = {
            label: 'Botão',
            category: $this.strBlockText,
            media: `<a href="#" class="btn btn-primary">Botão</a>`,
            attributes: { class: '', title: "Adicione o bloco" },
            resizable: true,
            content: `
                        <a href="#" target="_blank" class="btn" style="display:flex; justify-content:center;align-items:center;background-color: #dc245a; border-radius: 12px; padding: 9px 21px; margin: 10px; font-weight: 500; text-decoration: none; color: #fff;" data-gjs-resizable="true">
                            Botão aqui
                        </a>`
        };

        // Item de separação de conteúdo
        $this.objBlocksDefault['separator'] = {
            label: 'Separador',
            category: $this.strBlockText,
            attributes: { class: '', title: "Adicione o bloco" },
            media: `<img src="/builder/svg/hr.svg" class='icon-tools' style="width:45px">`,
            custom: true,
            resizable: true,
            content: `
                    <hr style="background-color: #000; width: 100%; align: center; height: 2%; margin: 10px auto; border: none;" data-gjs-resizable="true">
                    `
        };

        // Conteúdo de link
        $this.objBlocksDefault['link'] = {
            label: 'Link',
            category: $this.strBlockText,
            attributes: { title: "Adicione um bloco" },
            media: `<img src="/builder/svg/link.svg" class='icon-tools' style="width:45px">`,
            content:
                `
                    <a href="#" class="plcs-link" style="width: auto;">
                         Seu link Link 
                    </a>
                    `
        };
        // FIM BLOCOS MAIS USADOS

        //COMEÇO BLOCOS DE LAYOUT
        // Uma coluna padrão
        $this.objBlocksDefault['custom-collumn-1'] = {
            label: 'Uma coluna',
            category: $this.strBlockLayout,
            media: `<img src="/builder/svg/column-1.svg" class='icon-tools' style="width:45px">`,
            attributes: { class: '', title: "Adicione o bloco" },
            editable: true,
            draggable: true,
            stylable: true,
            selectable: true,
            resizable: true,
            content: `
                    <div style="width: 100%; min-height: 45px; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; box-sizing: border-box; padding: 10px;" data-gjs-resizable="true">
                        <div style="width: 100%; font-family: sans-serif; min-height: 45px; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 10px; box-sizing: border-box" data-gjs-resizable="true"></div>
                    </div>
                    `
        };

        // Duas colunas iguais
        $this.objBlocksDefault['custom-collumn-2'] = {
            label: 'Duas colunas',
            category: $this.strBlockLayout,
            media: `<img src="/builder/svg/column-2.svg" class='icon-tools' style="width:45px">`,
            attributes: { class: '', title: "Adicione o bloco" },
            editable: true,
            draggable: true,
            stylable: true,
            selectable: true,
            resizable: true,
            content: `
              <div style="width: 100%; min-height: 45px; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; box-sizing: border-box; padding: 10px;" data-gjs-resizable="true">
                <div class="plc-div-50" style=" font-family: sans-serif;min-height: 45px; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 10px; box-sizing: border-box;" data-gjs-resizable="true"></div>
                <div class="plc-div-50" style=" font-family: sans-serif;min-height: 45px; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 10px; box-sizing: border-box;" data-gjs-resizable="true"></div>
              </div>
            `
        };

        // Duas colunas diferentes, menor primeiro
        $this.objBlocksDefault['custom-collumn-2b'] = {
            label: 'Duas colunas',
            category: $this.strBlockLayout,
            media: `<img src="/builder/svg/column-2b.svg" class='icon-tools' style="width:45px">`,
            attributes: { class: '', title: "Adicione o bloco" },
            editable: true,
            draggable: true,
            stylable: true,
            selectable: true,
            resizable: true,
            content: `
                    <div style="width: 100%; min-height: 45px; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; box-sizing: border-box; padding: 10px;" data-gjs-resizable="true">
                        <div class="plc-div-20" style=" font-family: sans-serif;min-height: 45px; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 10px; box-sizing: border-box;" data-gjs-resizable="true"></div>
                        <div class="plc-div-80" style=" font-family: sans-serif;min-height: 45px; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 10px; box-sizing: border-box;" data-gjs-resizable="true"></div>
                    </div>
                    `
        };

        // Duas colunas diferentes, maior primeiro
        $this.objBlocksDefault['custom-collumn-2c'] = {
            label: 'Duas colunas',
            category: $this.strBlockLayout,
            media: `<img src="/builder/svg/column-2c.svg" class='icon-tools' style="width:45px">`,
            attributes: { class: '', title: "Adicione o bloco" },
            editable: true,
            draggable: true,
            stylable: true,
            selectable: true,
            resizable: true,
            content: `
                    <div style="width: 100%; min-height: 45px; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; box-sizing: border-box; padding: 10px;" data-gjs-resizable="true">
                        <div class="plc-div-80" style=" font-family: sans-serif;min-height: 45px; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 10px; box-sizing: border-box;" data-gjs-resizable="true"></div>
                        <div class="plc-div-20" style=" font-family: sans-serif;min-height: 45px; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 10px; box-sizing: border-box;" data-gjs-resizable="true"></div>
                    </div>
                    `
        };

        // Três colunas iguais
        $this.objBlocksDefault['custom-collumn-3'] = {
            label: 'Três colunas',
            category: $this.strBlockLayout,
            media: `<img src="/builder/svg/column-3.svg" class='icon-tools' style="width:45px">`,
            attributes: { class: '', title: "Adicione o bloco" },
            editable: true,
            draggable: true,
            stylable: true,
            selectable: true,
            resizable: true,
            content: `
                    <div style="width: 100%; min-height: 45px; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; box-sizing: border-box; padding: 10px;" data-gjs-resizable="true">
                        <div class="plc-div-333" style=" font-family: sans-serif;min-height: 45px; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 10px; box-sizing: border-box;" data-gjs-resizable="true"></div>
                        <div class="plc-div-333" style=" font-family: sans-serif;min-height: 45px; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 10px; box-sizing: border-box;" data-gjs-resizable="true"></div>
                        <div class="plc-div-333" style=" font-family: sans-serif;min-height: 45px; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 10px; box-sizing: border-box;" data-gjs-resizable="true"></div>
                    </div>
                    `
        };

        // Três colunas diferentes
        $this.objBlocksDefault['custom-collumn-3b'] = {
            label: 'Três colunas',
            category: $this.strBlockLayout,
            media: `<img src="/builder/svg/column-3b.svg" class='icon-tools' style="width:45px">`,
            attributes: { class: '', title: "Adicione o bloco" },
            editable: true,
            draggable: true,
            stylable: true,
            selectable: true,
            resizable: true,
            type: 'default',
            content: `
                    <div style="width: 100%; min-height: 45px; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; box-sizing: border-box; padding: 10px;" data-gjs-resizable="true">
                        <div class="plc-div-15" style=" font-family: sans-serif;min-height: 45px; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 10px; box-sizing: border-box;" data-gjs-resizable="true"></div>
                        <div class="plc-div-70" style=" font-family: sans-serif;min-height: 45px; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 10px; box-sizing: border-box;" data-gjs-resizable="true"></div>
                        <div class="plc-div-15" style=" font-family: sans-serif;min-height: 45px; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 10px; box-sizing: border-box;" data-gjs-resizable="true"></div>
                    </div>
                    `
        };

        // FIM BLOCOS DE LAYOUT

        // COMEÇO DE BLOCOS DE ADDONS
        $this.objBlocksDefault['video-01'] = {
            label: 'Vídeo',
            category: $this.strBlockField,
            media: `<img src="/builder/svg/video.svg" class='icon-tools' style="width:45px">`,
            attributes: { class: '', title: "Adicione um vídeo" },
            content: ` <video allowfullscreen="allowfullscreen" id="igkx" src="img/video2.webm" controls="controls" style="width: 100%"> `
        };

        $this.objBlocksDefault['plices-map'] = {
            label: 'Mapa',
            category: $this.strBlockField,
            media: `<img src="/builder/svg/map.svg" class='icon-tools' style="width:45px">`,
            attributes: { class: '', title: "Adicione um mapa" },
            content: `<iframe frameborder="0" width="100%" height="400px" style="visibility: visible;" src="https://maps.google.com/maps?&z=1&t=q&output=embed"></iframe>`
        };

        // Blocos de links
        $this.objBlocksDefault['link-block'] = {
            label: 'bloco de link',
            category: $this.strBlockField,
            attributes: { title: "Adicione um bloco" },
            media: `<img src="/builder/svg/link.svg" class='icon-tools' style="width:45px">`,
            content:
                `
                    <a data-gjs-highlightable="true"  style="width: auto;" data-gjs-type="link" draggable="true" class=""> link 01 </a>
                    <a data-gjs-highlightable="true"  style="width: auto;" data-gjs-type="link" draggable="true" class=""> link 02 </a>
                    <a data-gjs-highlightable="true"  style="width: auto;" data-gjs-type="link" draggable="true" class=""> link 03 </a>
                    `
        };

        // lista padrão
        $this.objBlocksDefault['list'] = {
            label: 'Lista de marcadores',
            category: $this.strBlockField,
            attributes: { title: "Adicione uma Lista de marcadores" },
            media: `<i class='fa fa-list' style='font-size: 43px !important;'></i>`,
            content:
                `
                    <ul data-bold="inherit" data-gramm="false">
                            <li>
                                <i contenteditable="false" class="fa fa-fw fa-check"></i>
                                <b>Benefícios:</b> Nossos produtos são entregues imediatamente
                            </li>
                            <li>
                                <i contenteditable="false" class="fa fa-fw fa-check"></i>
                                <b>Característica:</b> Explique o benefício de seus produtos
                            </li>
                            <li>
                                <i contenteditable="false" class="fa fa-fw fa-check"></i>
                                <b>Icone:</b>Altere os ícones nas configurações
                            </li>
                      </ul>
                      `
        };

        //blocos de citações
        $this.objBlocksDefault['quote'] = {
            label: 'Citação',
            category: $this.strBlockField,
            attributes: { class: '', title: "Adicione uma citação" },
            media: `<i class='fa fa-quote-left' style='font-size: 43px !important;'></i>`,
            content: `
                <figure class="text-center">
                    <blockquote class="blockquote">
                    <p>A well-known quote, contained in a blockquote element.</p>
                    </blockquote>
                    <figcaption class="blockquote-footer">
                    Someone famous in <cite title="Source Title">Source Title</cite>
                    </figcaption>
                </figure>                   
                `
        };
        // FIM DE BLOCOS DE ADDONS

    }

    /**
     * Carrega os campos de formulários
     */
    getBlocksField() {
        var $this = this;

        if (this.booEnableFields == true) {
            //Busca os dados do usuário
            utility.post('/app/form/fieldsList', {})
                .done(function (data) {
                    if (data.success === true) {
                        $.each(data.data.fields, function (index, field) {
                            var strHtml = "";
                            strHtml += '<div class="plc-form-group plc-mb-3" field-metadata="' + field.metadata_name + '">';
                            strHtml += '<label class="plc-label label_' + field.metadata_name + '">' + field.label + '</label>';
                            var strIcon = 'form';
                            var strPlaceholder = field.help_tex != null ? field.help_tex : '';
                            switch (field.type) {
                                case 'text':
                                    strIcon = 'pause';
                                    strHtml += '<input type="text" class="plc-input plc-input plc-form-control plc-' + field.type + '" id="' + field.metadata_name + '" name="' + field.metadata_name + '" placeholder="' + strPlaceholder + '" >';
                                    break;
                                case 'textarea':
                                    strIcon = 'pause';
                                    strHtml += '<textarea class="plc-textarea plc-form-control ' + field.type + '" id="' + field.metadata_name + '" name="' + field.metadata_name + '" placeholder="' + strPlaceholder + '" ></textarea>';
                                    break;
                                case 'integer':
                                    strIcon = 'pause';
                                    strHtml += '<input type="text" class="plc-input plc-form-control ' + field.type + ' plices-mask-integer" id="' + field.metadata_name + '" name="' + field.metadata_name + '" placeholder="' + strPlaceholder + '" >';
                                    break;
                                case 'decimal':
                                    strIcon = 'pause';
                                    strHtml += '<input type="text" class="plc-input plc-form-control ' + field.type + ' plices-mask-decimal" id="' + field.metadata_name + '" name="' + field.metadata_name + '" placeholder="' + strPlaceholder + '" >';
                                    break;
                                case 'email':
                                    strIcon = 'pause';
                                    strHtml += '<input type="email" class="plc-input plc-form-control ' + field.type + '" id="' + field.metadata_name + '" name="' + field.metadata_name + '" placeholder="' + strPlaceholder + '" >';
                                    break;
                                case 'phone':
                                    strIcon = 'pause';
                                    strHtml += '<input type="text" class="plc-input plc-form-control ' + field.type + ' plices-mask-phone" id="' + field.metadata_name + '" name="' + field.metadata_name + '" maxlength="15" placeholder="' + strPlaceholder + '"  title="' + strPlaceholder + '" >';
                                    break;
                                case 'cep':
                                    strIcon = 'pause';
                                    strHtml += '<input type="text" class="plc-input plc-form-control ' + field.type + ' plices-mask-cep" maxlength="9" id="' + field.metadata_name + '" name="' + field.metadata_name + '" placeholder="' + strPlaceholder + '" >';
                                    break;
                                case 'cpf':
                                    strIcon = 'pause';
                                    strHtml += '<input type="text" class="plc-input plc-form-control ' + field.type + ' plices-mask-cpf"  maxlength="14" id="' + field.metadata_name + '" name="' + field.metadata_name + '" placeholder="' + strPlaceholder + '" >';
                                    break;
                                case 'cnpj':
                                    strIcon = 'pause';
                                    strHtml += '<input type="text" class="plc-input plc-form-control ' + field.type + ' plices-mask-cnpj" maxlength="18" id="' + field.metadata_name + '" name="' + field.metadata_name + '" placeholder="' + strPlaceholder + '" >';
                                    break;

                                case 'date':
                                    strIcon = 'pause';
                                    strHtml += '<input type="text" class="plc-input plc-form-control ' + field.type + ' plices-mask-date" maxlength="10" id="' + field.metadata_name + '" name="' + field.metadata_name + '" placeholder="' + strPlaceholder + '" >';
                                    break;

                                case 'time':
                                    strIcon = 'pause';
                                    strHtml += '<input type="text" class="plc-input plc-form-control ' + field.type + ' plices-mask-time" maxlength="5" id="' + field.metadata_name + '" name="' + field.metadata_name + '" placeholder="' + strPlaceholder + '" >';
                                    break;

                                case 'money':
                                    strIcon = 'pause';
                                    strHtml += '<input type="text" class="plc-input plc-form-control ' + field.type + ' plices-mask-money" id="' + field.metadata_name + '" name="' + field.metadata_name + '" placeholder="' + strPlaceholder + '" >';
                                    break;

                                case 'checkbox':
                                    strIcon = 'pause';
                                    strHtml += '';
                                    strHtml += '<div>';
                                    $.each(field.options, function (key, option) {
                                        strHtml += '<div class="plc-float-start">';
                                        strHtml += '<input type="checkbox" class="plc-form-check-input ' + field.type + '" metadata="' + field.metadata_name + '" value="' + key + '" id="' + field.metadata_name + '_' + key + '" name="' + field.metadata_name + '[]" >';
                                        strHtml += '<label class="plc-pe-3 plc-ps-1">' + option + '</label>';
                                        strHtml += '</div>';
                                    });
                                    strHtml += '<div class="plc-clearfix"></div>';
                                    strHtml += '</div>';
                                    break;


                                case 'percent':
                                    strIcon = 'pause';
                                    strHtml += '<div class="plc-input-group plc-mb-3">';
                                    strHtml += '<span class="plc-input-group-text" id="basic-addon1">%</span>';
                                    strHtml += '<input type="number" class="plc-form-control ' + field.type + ' plices-mask-integer" id="' + field.metadata_name + '" max="100" min="0" name="' + field.metadata_name + '" placeholder="' + strPlaceholder + '" >';
                                    strHtml += '</div>';
                                    break;


                                case 'select':
                                    strIcon = 'pause';
                                    strHtml += '<select class="plc-form-select ' + field.type + '" id="' + field.metadata_name + '" name="' + field.metadata_name + '" placeholder="' + strPlaceholder + '" >';
                                    strHtml += '<option value="-1">Selecione</option>';
                                    $.each(field.options, function (key, option) {
                                        strHtml += '<option value="' + key + '">' + option + '</option>';
                                    });
                                    strHtml += '</select>';
                                    break;


                                case 'radiobutton':
                                    strIcon = 'pause';
                                    strHtml += '<div>';
                                    $.each(field.options, function (key, option) {
                                        strHtml += '<div class="plc-float-start">';
                                        strHtml += '<input type="radio" class="plc-form-check-input ' + field.type + '" value="' + key + '" id="' + field.metadata_name + '" name="' + field.metadata_name + '" >';
                                        strHtml += '<label class="plc-pe-3 plc-ps-1">' + option + '</label>';
                                        strHtml += '</div>';
                                    });
                                    strHtml += '<div class="plc-clearfix"></div>';
                                    strHtml += '</div>';
                                    break;

                                default:

                                    break;
                            }
                            strHtml += '</div>';

                            $this.objBlocksField['field_' + field.metadata_name] = {
                                id: 'field_' + field.metadata_name,
                                label: field.label,
                                category: $this.strBlockField,
                                media: '<img src="/builder/svg/field/' + field.type + '.svg" class="icon-tools" style="width:45px">',
                                attributes: { class: '', title: "Adicione o campo" },
                                content: strHtml
                            };
                        });
                    }
                });
        }
    }

    /**
     * Carrega os blocos dos usuários
     */
    getBlocksUser() {
        var $this = this;
        if (this.booEnablePageBlocks == true) {
            //Busca os dados do usuário
            utility.post('/app/cms/page-block/active-blocks', {})
                .done(function (data) {
                    if (data.success === true) {
                        $.each(data.data.records, function (index, block) {
                            var strBlockId = utility.normalizeString(block.name);
                            var strMedia = ''
                            if (block.status == 'thumb') {
                                strMedia = `<img src="/builder/svg/block.svg" class='icon-tools' style="width:45px">`;
                            } else {
                                strMedia = '<img src="' + data.data.url + '/image/' + data.data.businessCode + '/page_block_thumb/' + block.id + '" style="width:-webkit-fill-available;">'
                            }

                            $this.objBlocksUser['block_' + strBlockId] = {
                                id: 'block_' + strBlockId,
                                label: block.name,
                                category: $this.strBlockModel,
                                media: strMedia,
                                attributes: { class: '', title: "Adicione o bloco" },
                                content: "<style>" + block.style + "</style>" + block.html
                            };
                        });
                    }
                });
        }
    }

    /**
     * Carrega os blocos dos e-mails
     */
    getBlocksEmailUser() {
        var $this = this;

        if (this.booEnableEmailBlocks == true) {
            //Busca os dados do usuário
            utility.post('/app/message/email-block/list-active', {})
                .done(function (data) {
                    if (data.success === true) {
                        $.each(data.data.records, function (index, block) {
                            var strBlockId = utility.normalizeString(block.name);
                            var strMedia = ''
                            if (block.status == 'thumb') {
                                strMedia = `<img src="/builder/svg/block.svg" class='icon-tools' style="width:45px">`;
                            } else {
                                strMedia = '<img src="' + data.data.url + '/image/' + data.data.businessCode + '/email_block_thumb/' + block.id + '" style="width:-webkit-fill-available;">'
                            }
                            $this.objBlocksEmailUser['block_' + strBlockId] = {
                                id: 'block_' + strBlockId,
                                label: block.name,
                                category: $this.strBlockModel,
                                media: strMedia,
                                attributes: { class: '', title: "Adicione o bloco" },
                                content: "<style>" + block.style + "</style>" + block.html
                            };
                        });
                    }
                });
        }
    }

    /**
     * Carrega os blocs de páginas
     */
    getBlocksPage() {
        var $this = this;

        if ($this.booPageElements) {
            var arrBlocksHtml = {
                'Cards': [['plcs-section', 'Sessão'], ['plc-card-teste', 'Card padrão'], ['plc-card-02', 'Card 2']],
                'Menu': [['plc-menu-01', 'Menu 01'], ['plc-menu-02', 'Menu 02'], ['plc-menu-03', 'Menu 03']],
                'Hero - Venda': [['plc-hero-01', 'Hero 01'], ['plc-hero-02', 'Hero 02'], ['plc-hero-03', 'Hero 03'], ['plc-hero-04', 'Hero 04'], ['plc-hero-terra', 'Terra'], ['plc-hero-oslo', 'Oslo'], ['plc-hero-saara', 'Saara'], ['plc-hero-pink', 'Pink'], ['plc-hero-purple', 'Purple'], ['plc-hero-swit', 'Swit']],
                'Problemas': [['plc-problem-01', 'Problema 01'], ['plc-problem-saara', 'Saara']],
                'Soluções': [['plc-solution-01', 'Soluções 01'], ['plc-solution-terra', 'Terra'], ['plc-solution-oslo', 'Oslo'], ['plc-solution-saara', 'Saara'], ['plc-solution-purple1', 'Purple 1'], ['plc-solution-purple2', 'Purple 2']],
                'Credenciais': [['plc-cred-01', 'Credenciais 01']],
                'Benefícios': [['plc-benefits-01', 'Benefícios 01'], ['plc-benefits-terra', 'Terra'], ['plc-benefits-oslo', 'Oslo'], ['plc-benefits-saara', 'Saara'], ['plc-benefits-pink', 'Pink']],
                'Provas sociais': [['plc-prova-01', 'Prova 01'], ['plc-prova-terra', 'Terra'], ['plc-prova-oslo', 'Oslo'], ['plc-prova-saara', 'Saara'], ['plc-prova-globe', 'Globe']],
                'Ofertas': [['plc-ofertas-01', 'Ofertas 01'], ['plc-ofertas-terra', 'Terra'], ['plc-ofertas-oslo', 'Oslo'], ['plc-ofertas-saara', 'Saara']],
                'Garantias': [['plc-garantia-01', 'Garantia 01']],
                'Escassez': [['plc-escassez-01', 'Escassez 01']],
                'Chamada de ação': [['plc-chamada-01', 'Chamada 01'], ['plc-chamada-purple', 'Purple']],
                'Aviso': [['plc-aviso-01', 'Aviso 01'], ['plc-aviso-terra', 'Terra'], ['plc-aviso-oslo', 'Oslo'], ['plc-aviso-saara', 'Saara'], ['plc-aviso-purple', 'Purple']],
                'Lembrete': [['plc-lembrete-01', 'Lembrete 01'], ['plc-lembrete-terra', 'Terra'], ['plc-lembrete-oslo', 'Oslo'], ['plc-lembrete-saara', 'Saara']],
                'Footer': [['plc-footer-terra', 'Terra'], ['plc-footer-oslo', 'Oslo'], ['plc-footer-saara', 'Saara'], ['plc-footer-pink', 'Pink'], ['plc-footer-purple', 'Purple'], ['plc-footer-swit', 'Swit']],
            };
            $.each(arrBlocksHtml, function (name, block) {
                $.each(block, function (index, info) {

                    var folder = info[0];
                    var strName = info[1];

                    fetch('/builder/blocks/assets/pages/' + folder + '.html')
                        .then(response => response.text())
                        .then((html) => {
                            $this.objBlocksPage['block_' + folder] = {
                                id: 'block_' + folder,
                                label: strName,
                                category: name,
                                media: `<img src="/builder/blocks/assets/pages/` + folder + `.png"  style="width:100%">`,
                                attributes: { class: '', title: "Adicione o bloco" },
                                content: html
                            };
                        })
                });

            });
        }
    }

    /**
     * Pega os formulários do usuário
     */
    getBlocksFormsPlices() {
        var $this = this;
        // Busca os dados do usuário
        utility.post('/app/cms/builderList', {})
            .done(function (data) {
                if (data.success === true) {
                    if ($this.booFormsPlices) {
                        $.each(data.data.forms, function (index, form) {
                            switch (form.type) {
                                case 'embed':
                                    var strIcon = 'newspaper';
                                    var strTitle = _('Simples');
                                    var strText = '';
                                    break;
                                case 'popup':
                                    var strIcon = 'copy';
                                    var strTitle = _('Flutuante');
                                    var strText = '';
                                    break;
                                case 'popover':
                                    var strIcon = 'comment-alt ';
                                    var strTitle = _('No texto');
                                    var strText = 'Altere seu texto';
                                    break;
                                case 'botton':
                                    var strIcon = 'paste';
                                    var strTitle = _('Flutuante de fundo');
                                    var strText = '';
                                    break;
                                case 'offcanvas':
                                    var strIcon = 'pause';
                                    var strTitle = _('Barra lateral');
                                    var strText = '';
                                    break;

                                default:
                                    break;
                            }

                            $this.objBlocksFormsPlices['form_plices_' + form.id] = {
                                id: 'form_plices_' + form.id,
                                label: strTitle + ' (' + form.name + ')',
                                category: 'Formulários Plices',
                                media: "<i class='fas fa-" + strIcon + "' style='font-size: 43px !important;' title='" + strTitle + "'  data-bs-toggle='tooltip'></i>",
                                attributes: { class: '', title: "Adicione o formulário" },
                                content: "<span class='plices-form' form-code='" + form.code + "'>" + strText + "</span>"
                            };
                        });
                    }
                }
            });
    }

    /**
     * Blocos de formulários
     */
    getBlocksForm() {
        var $this = this;
        if ($this.booFormElements) {
            var arrBlocksHtml = {}
            // var arrBlocksHtml = {
            //     'Formulários': [['plc-email-01', 'Formulário 01']],
            // };
            $.each(arrBlocksHtml, function (name, block) {
                $.each(block, function (index, info) {
                    var folder = info[0];
                    var strName = info[1];

                    fetch('/builder/blocks/assets/forms/' + folder + '.html')
                        .then(response => response.text())
                        .then((html) => {
                            $this.objBlocksForm['block_' + folder] = {
                                id: 'block_' + folder,
                                label: strName,
                                category: name,
                                media: `<img src="/builder/blocks/assets/forms/` + folder + `.png"  style="width:100%">`,
                                attributes: { class: '', title: "Adicione o bloco" },
                                content: html
                            };
                        })


                });

            });
        }
    }

    /**
     * Pega blocos de e-mails
     */
    getBlocksEmail() {
        var $this = this;
        if ($this.booEmailElements) {
            var arrBlocksHtml = {};
            // var arrBlocksHtml = {
            //     'E-mails': [['plc-email-01', 'E-mail 01']],
            // };
            $.each(arrBlocksHtml, function (name, block) {
                $.each(block, function (index, info) {

                    var folder = info[0];
                    var strName = info[1];

                    fetch('/builder/blocks/assets/emails/' + folder + '.html')
                        .then(response => response.text())
                        .then((html) => {
                            $this.objBlocksEmail['block_' + folder] = {
                                id: 'block_' + folder,
                                label: strName,
                                category: name,
                                media: `<img src="/builder/blocks/assets/emails/` + folder + `.png"  style="width:100%">`,
                                attributes: { class: '', title: "Adicione o bloco" },
                                content: html
                            };
                        })
                });

            });
        }

    }

    /*
     * Monta os blocos customizados que podem ser utilizados
     */
    async defineBlocks() {
        var $this = this;

        var arrBlocks = [];
        arrBlocks.push($this.objBlocksField);
        arrBlocks.push($this.objBlocksDefault);
        arrBlocks.push($this.objBlocksUser);
        arrBlocks.push($this.objBlocksEmailUser);
        arrBlocks.push($this.objBlocksPage);
        arrBlocks.push($this.objBlocksFormsPlices);
        arrBlocks.push($this.objBlocksForm);
        arrBlocks.push($this.objBlocksEmail);



        $.each(arrBlocks, function (idx, arrBlock) {

            $.each(arrBlock, function (index, block) {
                if (block.id == undefined) {
                    block.id = index;
                }
                $this.arrBlocksTreated.push(block);
            });
        });
    }

    async initialize(intVariation = null) {
        var $this = this;

        // Monta os blocos
        await $this.defineBlocks()

        $this.editor = grapesjs.init({
            container : '#gjs',
            storageManager: false,
            plugins: this.arrPlugins,
            allowScripts: true,
            showOffsets: 1,
            noticeOnUnload: 0,
            clearOnRender: true,
            height: '100%',
            traitsManager: { showTraits: true },
            selectorManager: { componentFirst: true, },
            fromElement: true,
            styleManager: {
                clearProperties: 1,
                sectors: [
                    {
                        name: 'Geral',
                        open: true,
                        properties: [
                        //{ extend: 'width', label: 'Largura', title: 'Define a largura de um elemento.' },
                            {
                                name: 'Largura do elemento',
                                title: 'Ajuste a largura do elemento',
                                property: 'width',
                                type: 'radio',
                                defaults: 'auto',
                                list: [
                                    {
                                        value: '100%',
                                        name: 'Total',
                                        label: 'Total',
                                        title: 'Largura total da tela',
                                    },
                                    {
                                        value: '50%',
                                        name: 'Ocupar metade',
                                        label: 'Metade',
                                        title: 'Ocupar metade da largura do elemento pai',
                                    },
                                    {
                                        value: 'auto',
                                        name: 'Ajustar ao conteúdo',
                                        label: 'Ajustar',
                                        title: 'Ajustar ao conteúdo',
                                    },
                                ],
                            },
                            {
                                name: 'Altura do elemento',
                                title: 'Ajuste a altura do elemento',
                                property: 'height',
                                type: 'radio',
                                defaults: 'auto',
                                list: [
                                    {
                                        value: '100%',
                                        name: 'Altura total do elemnto pai',
                                        label: 'Total',
                                        title: 'Largura total da tela',
                                    },
                                    {
                                        value: '50%',
                                        name: 'Metade da altura do elemento pai.',
                                        label: 'Metade',
                                        title: 'Metade da altura do elemento pai.',
                                    },
                                    {
                                        value: '100vh',
                                        name: 'Ocupar espaço do tamanho de uma tela',
                                        label: 'Tela cheia',
                                        title: 'Ocupar espaço do tamanho de uma tela',
                                    },
                                    {
                                        value: 'auto',
                                        name: 'Ajustar ao conteúdo',
                                        label: 'Ajustar',
                                        title: 'Ajustar ao conteúdo',
                                    },
                                ],
                            },
                            { extend: 'background', label: 'Background do elemento', title: 'Define uma imagem. cor ou gradiente para o fundo do elemento.' },
                            { extend: 'font-family', label: 'Fonte', title: 'Define a família de fonte a ser usada para o texto de um elemento. É usado para especificar o tipo de fonte, como Arial, Verdana, Times New Roman, entre outras.' },
                            { extend: 'font-size', label: 'Tamanho', default: 'Médio', title: 'Define o tamanho da fonte para o texto de um elemento. Pode ser especificado em unidades como pixels, ems ou porcentagem.' },
                            { extend: 'color', label: 'Cor de texto', default: 'Componente', title: 'Define a cor do texto de um elemento. Pode ser especificado em diferentes formatos, como nomes de cores (como red, blue), valores hexadecimais (como #ff0000 para vermelho) ou valores RGB (como rgb(255, 0, 0) para vermelho).' },
                            {
                                extend: 'text-align',
                                title: 'Essas propriedades do text-align são usadas para alinhar o texto horizontalmente dentro de um elemento. Elas podem ser aplicadas a elementos de bloco, como parágrafos, títulos ou divs, para controlar a aparência do texto. O alinhamento do texto ajuda a melhorar a legibilidade e a estética do conteúdo, garantindo que o texto seja apresentado de maneira clara e organizada na página.',
                                label: 'Alinhamento do texto',
                                options: [
                                    { id: 'left', label: 'Esqueda', className: 'fa fa-align-left', title: 'Alinha o texto à esquerda do elemento. É o valor padrão para elementos de bloco.' },
                                    { id: 'center', label: 'Centro', className: 'fa fa-align-center', title: 'Centraliza o texto horizontalmente dentro do elemento.' },
                                    { id: 'right', label: 'Direita', className: 'fa fa-align-right', title: 'Alinha o texto à direita do elemento.' },
                                    { id: 'justify', label: 'Justificado', className: 'fa fa-align-justify', title: 'Distribui o texto uniformemente ao longo da largura do elemento, ajustando os espaços entre as palavras para preencher toda a largura.' }
                                ],
                            },
                            /*{
                                name: 'my-fill', // Nome único para o componente
                                type: 'color', // Tipo do componente (neste caso, 'color' para o seletor completo de cores)
                                label: 'Preenchimento', // Rótulo exibido no styleManager
                                property: 'fill', // Propriedade CSS que será definida ao selecionar uma cor
                                defaults: 'transparent', // Valor padrão do preenchimento
                                title: 'Preenchimento', // Título exibido no seletor de cores
                            },*/
                            {
                                name: 'Direção dos elementos',
                                title: 'Ajuste a direção de elementos dentro de uma div ou seção, em linha os elementos vão respeitar a largura atribuidas a ele, e em coluna eles vão respeitar a sequência, ficando um sobre o outro em ordem de colocação',
                                property: 'flex-direction',
                                type: 'radio',
                                defaults: 'row',
                                list: [{
                                    value: 'row',
                                    name: 'Linha',
                                    className: 'icons-flex icon-dir-row fa-solid fa-arrow-right-long',
                                    title: 'Em linha: Os elementos ficam em linha respeitando os tamanhos referenciados a ele',
                                }, {
                                    value: 'row-reverse',
                                    name: 'Linha reversa',
                                    className: 'icons-flex icon-dir-row-rev fa-solid fa-right-left',
                                    title: 'Linha reversa: Os elementos ficam em linha, mas sua ordem será invertido, esse modo é muito usado para criar responsividade, e usar posição diferente em desktop e mobile',
                                }, {
                                    value: 'column',
                                    name: 'Coluna',
                                    title: 'Coluna: Os elementos ficam um sobre o outro respeitando sua ordem natural, e não faz diferença o tamanho de largura referenciado a ele',
                                    className: 'icons-flex icon-dir-col fa-solid fa-arrow-down-long',
                                }, {
                                    value: 'column-reverse',
                                    name: 'Coluna reversa',
                                    title: 'Coluna reversa: Os elementos ficam um sobre o outro, mas a ordem fica inversa, e não faz diferença o tamanho de largura referenciado a ele. Esse modelo é muito usado para responsividade, diferenciando itens em desktop e mobile.',
                                    className: 'icons-flex icon-dir-col-rev fa-solid fa-retweet',
                                }],
                            }, {
                                name: 'Alinhamento Horizontal dos elementos',
                                title: 'Alinhamento Horizontal dos elementos',
                                property: 'justify-content',
                                type: 'radio',
                                defaults: 'center',
                                list: [{
                                    value: 'flex-start',
                                    className: 'icons-flex icon-just-start fa-solid fa-chevron-left',
                                    title: 'Start: Alinha os itens ao início do container flexível. Os itens são colocados no canto esquerdo do container',
                                }, {
                                    value: 'flex-end',
                                    title: 'End: Alinha os itens ao final do container flexível. Os itens são colocados no canto direito do container',
                                    className: 'icons-flex icon-just-end fa-solid fa-chevron-right',
                                }, {
                                    value: 'space-between',
                                    title: 'Espaço entre: Distribui os itens igualmente ao longo do eixo horizontal do container flexível. O primeiro item é colocado no início e o último item é colocado no final, com o espaço restante distribuído igualmente entre os itens',
                                    className: 'icons-flex icon-just-sp-bet fa-solid fa-grip-lines-vertical',
                                }, {
                                    value: 'space-around',
                                    title: 'Distribui os itens igualmente ao longo do eixo horizontal do container flexível, com espaços iguais antes e depois de cada item. Isso cria um espaço igual em ambos os lados dos itens',
                                    className: 'icons-flex icon-just-sp-ar fa-solid fa-equals',
                                }, {
                                    value: 'center',
                                    title: 'Centro: Alinha os itens ao centro horizontal do container flexível. Os itens são centralizados horizontalmente no container',
                                    className: 'plc-icons-flex icon-just-sp-cent fa-solid fa-arrows-to-dot',
                                }],
                            }, {
                                name: 'Alinhamento Vertical dos elementos',
                                title: 'Alinhe elementos na vertical dentro de uma div ou seção',
                                property: 'align-items',
                                type: 'radio',
                                defaults: 'center',
                                list: [{
                                    value: 'flex-start',
                                    title: 'Start: Alinha os itens ao início do container flexível ao longo do eixo vertical. Os itens são colocados no topo do container',
                                    className: 'icons-flex icon-al-start fa-solid  fa-arrows-up-to-line',
                                }, {
                                    value: 'flex-end',
                                    title: 'End: Alinha os itens ao final do container flexível ao longo do eixo vertical. Os itens são colocados na parte inferior do container',
                                    className: 'icons-flex icon-al-end fa-solid fa-arrows-down-to-line',
                                }, {
                                    value: 'stretch',
                                    title: 'Stretch: Estica os itens para ocupar a altura total do container flexível ao longo do eixo vertical. Os itens são esticados verticalmente para preencher o container',
                                    className: 'icons-flex icon-al-str fa-solid fa-expand',
                                }, {
                                    value: 'center',
                                    title: 'Centro: Alinha os itens ao centro vertical do container flexível. Os itens são centralizados verticalmente no container',
                                    className: 'icons-flex icon-al-center fa-solid fa-arrows-to-circle',
                                }],
                            },
                            { extend: 'margin', label: 'Espaço externo', title: 'Essas propriedades do margin são usadas para controlar o espaçamento externo de um elemento em relação aos seus elementos vizinhos. Elas permitem adicionar margens em cada um dos lados do elemento para criar espaços em branco entre elementos adjacentes' },
                            { extend: 'padding', label: 'Espaço interno', title: 'Essas propriedades do padding são usadas para controlar o espaçamento interno de um elemento, ou seja, o espaço entre o conteúdo do elemento e suas bordas' },
                        ],
                    },
                    {
                        name: 'Display',
                        open: false,
                        properties: [
                            {
                                extend: 'float',
                                title: 'Flutuação do elemento',
                                label: 'Flutuação',
                                type: 'radio',
                                default: 'none',
                                options: [
                                    { value: 'none', className: 'fa fa-times', title: 'Nenhuma flutuação' },
                                    { value: 'left', className: 'fa fa-align-left', title: 'Flutuação a esquerda' },
                                    { value: 'right', className: 'fa fa-align-right', title: 'Flutuação a direita' }
                                ],
                            },
                            {
                                extend: 'display', label: 'Mostrar', type: 'radio', options: [
                                    { id: 'block', label: 'Bloco', title: 'Define um elemento como um bloco de nível de bloco. Isso significa que o elemento ocupa todo o espaço horizontal disponível e inicia uma nova linha. Os elementos de bloco geralmente têm largura e altura definidas e podem conter outros elementos dentro deles' },
                                    { id: 'inline', label: 'Em linha', title: 'Define um elemento como um elemento de nível de linha. Isso significa que o elemento ocupa apenas o espaço necessário para seu conteúdo e não inicia uma nova linha. Os elementos inline não têm largura e altura definidas, e outros elementos podem ser posicionados ao lado deles na mesma linha' },
                                    { id: 'inline-block', label: 'Bloco em linha', title: 'Combina as características de elementos inline e de bloco. Os elementos inline-block são posicionados na mesma linha, mas também podem ter largura e altura definidas, e outros elementos não são permitidos em seu mesmo espaço horizontal' },
                                    { id: 'flex', label: 'flexível', title: 'Define um elemento como um container flexível. Os elementos flexíveis usam o modelo de layout flexbox para organizar os elementos filhos em uma única linha ou em várias linhas, dependendo das propriedades e das configurações de alinhamento definidas. Os elementos flexíveis são usados para criar layouts responsivos e fluidos' },
                                    { id: 'none', label: 'Nenhum', title: 'A utilização de display: none é comum para ocultar elementos temporariamente ou dinamicamente em resposta a eventos ou interações do usuário. Por exemplo, você pode usar essa propriedade para mostrar e ocultar um menu dropdown, uma janela modal ou um elemento de uma lista quando não é mais necessário exibi-lo.' },
                                ]
                            },
                            {
                                extend: 'position', label: "Posição", options: [
                                    { id: 'static', label: 'Estático', title: ' É o valor padrão do position. Os elementos com position: static seguem o fluxo normal do documento. Eles não são afetados por outras propriedades de posicionamento, como top, right, bottom e left. Essa é a posição padrão para a maioria dos elementos HTML.' },
                                    { id: 'relative', label: 'Relativo', title: 'Com position: relative, você pode posicionar um elemento em relação à sua posição original. Isso permite que você use as propriedades top, right, bottom e left para mover o elemento em relação à sua posição normal no fluxo do documento. Outros elementos ainda ocupam o espaço original do elemento.' },
                                    { id: 'absolute', label: 'Absoluto', title: 'Com position: absolute, você pode posicionar um elemento em relação ao seu ancestral mais próximo com position diferente de static. O elemento é removido do fluxo normal do documento, e suas coordenadas são definidas pelas propriedades top, right, bottom e left. Se não houver um ancestral posicionado, o elemento será posicionado em relação ao documento.' },
                                    { id: 'fixed', label: 'Fixo', title: 'Com position: fixed, você pode posicionar um elemento em relação à janela de visualização. Ele permanece fixo mesmo quando a página é rolada. As propriedades top, right, bottom e left são usadas para especificar a posição do elemento em relação à janela.' },
                                ]
                            },
                            'top',
                            'right',
                            'left',
                            'bottom',


                        ],
                    },
                    {
                        name: 'Dimensão',
                        open: false,
                        properties: [
                            { extend: 'width', label: 'Largura', title: 'Define a largura de um elemento.' },
                            { extend: 'height', label: 'Altura', title: 'Define a altura de um elemento.' },
                            { extend: 'max-width', label: 'Largura máxima', title: 'Define a largura máxima permitida para um elemento. O elemento não pode ultrapassar esse limite.' },
                            { extend: 'max-height', label: 'Altura máxima', title: 'Define a altura máxima permitida para um elemento. O elemento não pode ultrapassar esse limite.' },
                            { extend: 'min-width', label: 'Largura mínima', title: 'Define a largura mínima necessária para um elemento. O elemento não pode ter uma largura menor do que esse valor.' },
                            { extend: 'min-height', label: 'Altura mínima', title: 'Define a altura mínima necessária para um elemento. O elemento não pode ter uma altura menor do que esse valor.' },
                            { extend: 'margin', label: 'Margem', title: 'Define o espaçamento externo de um elemento. É usado para criar espaço entre o elemento e outros elementos ao redor.' },
                            { extend: 'padding', label: 'Preenchimento', title: 'Define o espaçamento interno de um elemento. É usado para criar espaço entre o conteúdo do elemento e suas bordas.' },

                            // {
                            //     name: 'Preenchimento',
                            //     type: 'composite',
                            //     property: 'padding',
                            //     label: 'Preenchimento',
                            //     // Additional props
                            //     properties: [
                            //       { type: 'number', units: ['px', '%', 'em', 'rem', 'vh', 'vw'], default: '0', property: 'margin-top' },
                            //       { type: 'number', units: ['px', '%', 'em', 'rem', 'vh', 'vw'], default: '0', property: 'margin-right' },
                            //       { type: 'number', units: ['px', '%', 'em', 'rem', 'vh', 'vw'], default: '0', property: 'margin-bottom' },
                            //       { type: 'number', units: ['px', '%', 'em', 'rem', 'vh', 'vw'], default: '0', property: 'margin-left' },
                            //     ]
                            //   },                              

                        ],
                    },
                    {
                        name: 'Fonte',
                        open: false,
                        properties: [
                            { extend: 'font-family', label: 'Fonte', title: 'Define a família de fonte a ser usada para o texto de um elemento. É usado para especificar o tipo de fonte, como Arial, Verdana, Times New Roman, entre outras.' },
                            { extend: 'font-size', label: 'Tamanho', default: 'Médio', title: 'Define o tamanho da fonte para o texto de um elemento. Pode ser especificado em unidades como pixels, ems ou porcentagem.' },
                            { extend: 'font-weight', label: 'Espessura', default: 'Normal', title: 'Define o peso da fonte para o texto de um elemento. É usado para tornar o texto mais leve ou mais pesado, como negrito (bold) ou normal (normal).' },
                            { extend: 'letter-spacing', label: 'Espaçamento', default: 'Normal', title: ' Define o espaçamento entre os caracteres do texto de um elemento. Pode ser usado para aumentar ou diminuir o espaçamento entre as letras.' },
                            { extend: 'color', label: 'Cor', default: 'Componente', title: 'Define a cor do texto de um elemento. Pode ser especificado em diferentes formatos, como nomes de cores (como red, blue), valores hexadecimais (como #ff0000 para vermelho) ou valores RGB (como rgb(255, 0, 0) para vermelho).' },
                            { extend: 'line-height', label: 'Altura da linha', default: 'Normal', title: 'Define a altura da linha do texto de um elemento. É usado para controlar o espaçamento vertical entre as linhas de texto.' },
                            {
                                extend: 'text-align',
                                title: 'Essas propriedades do text-align são usadas para alinhar o texto horizontalmente dentro de um elemento. Elas podem ser aplicadas a elementos de bloco, como parágrafos, títulos ou divs, para controlar a aparência do texto. O alinhamento do texto ajuda a melhorar a legibilidade e a estética do conteúdo, garantindo que o texto seja apresentado de maneira clara e organizada na página.',
                                label: 'Alinhamento',
                                options: [
                                    { id: 'left', label: 'Esqueda', className: 'fa fa-align-left', title: 'Alinha o texto à esquerda do elemento. É o valor padrão para elementos de bloco.' },
                                    { id: 'center', label: 'Centro', className: 'fa fa-align-center', title: 'Centraliza o texto horizontalmente dentro do elemento.' },
                                    { id: 'right', label: 'Direita', className: 'fa fa-align-right', title: 'Alinha o texto à direita do elemento.' },
                                    { id: 'justify', label: 'Justificado', className: 'fa fa-align-justify', title: 'Distribui o texto uniformemente ao longo da largura do elemento, ajustando os espaços entre as palavras para preencher toda a largura.' }
                                ],
                            },
                            {
                                property: 'text-decoration',
                                title: 'Essas propriedades do text-decoration são usadas para adicionar ou remover decorações visuais em texto. O valor none remove qualquer decoração existente. O valor underline adiciona um sublinhado ao texto. O valor line-through adiciona uma linha através do texto. Essas propriedades podem ser aplicadas a elementos de texto individuais ou a seletores CSS mais amplos para estilizar o texto conforme desejado.',
                                label: 'Decoração',
                                type: 'radio',
                                default: 'none',
                                options: [
                                    { id: 'none', label: 'nenhum', className: 'fa fa-times', title: 'Remove qualquer decoração de texto, como sublinhado, linha através do texto ou efeito de tachado.' },
                                    { id: 'underline', label: 'Sublinhada', className: 'fa fa-underline', title: 'Adiciona um sublinhado ao texto.' },
                                    { id: 'line-through', label: 'Riscado', className: 'fa fa-strikethrough', title: 'Adiciona uma linha através do texto, cortando-o.' }
                                ],
                            },

                            { extend: 'text-shadow', label: 'Sombra no texto' },
                        ],
                    }, 
                    {
                        name: 'Bordas e fundo',
                        open: false,
                        properties: [
                            { extend: 'background-color', label: 'Cor de fundo', title: 'Define a cor de fundo de um elemento. Você pode especificar a cor usando nomes de cores, valores hexadecimais ou valores RGB.' },
                            { extend: 'opacity', label: 'Transparência', title: 'Define a opacidade de um elemento. Um valor de 1 significa totalmente opaco, enquanto um valor de 0 significa totalmente transparente.' },
                            {
                                extend: 'border-radius',
                                title: 'Define o raio dos cantos arredondados de um elemento. Pode ser aplicado tanto aos cantos horizontais quanto aos cantos verticais.',
                                label: 'Cantos arredondados',
                            },
                            { extend: 'border', label: 'Borda', title: 'Define as bordas de um elemento. Você pode especificar a largura, o estilo (como sólido, tracejado, pontilhado) e a cor da borda.' },
                            { extend: 'box-shadow', label: 'Sombra', title: 'Adiciona uma sombra ao redor de um elemento. Você pode definir a cor, a posição horizontal e vertical da sombra, o desfoque e o espalhamento.' },

                        ],
                    }, 
                    {
                        name: 'Configurações extras',
                        open: false,
                        properties: [
                            { extend: 'transition', label: 'Transição', title: 'Define as transições suaves entre diferentes estados de um elemento. Você pode especificar as propriedades a serem animadas, a duração da transição e a função de tempo para controlar a velocidade da animação.' },
                            { extend: 'perspective', label: 'Perspectiva', title: 'Define a perspectiva 3D para um elemento posicionado. Afeta como os elementos 3D são renderizados no espaço tridimensional.' },
                            { extend: 'transform', label: 'Transformar', title: 'Aplica transformações 2D ou 3D a um elemento, como rotação, escala, translação e inclinação.' },

                        ],
                    }, 
                    {
                        name: 'Flex',
                        open: false,
                        properties: [{
                            label: 'Container flexivel',
                            property: 'display',
                            type: 'select',
                            defaults: 'flex',
                            list: [
                                { value: 'block', name: 'Disable', label: 'Desabilitado' },
                                { value: 'flex', name: 'Enable', label: 'Habilitado' }
                            ],
                        }, {
                            name: 'Flex Pai',
                            property: 'label-parent-flex',
                            type: 'integer',
                        }, {
                            name: 'Direção',
                            property: 'flex-direction',
                            type: 'radio',
                            defaults: 'row',
                            list: [{
                                value: 'row',
                                name: 'Linha',
                                className: 'icons-flex icon-dir-row fa-solid fa-arrow-right-long',
                                title: 'Linha',
                            }, {
                                value: 'row-reverse',
                                name: 'Linha reversa',
                                className: 'icons-flex icon-dir-row-rev fa-solid fa-right-left',
                                title: 'Linha reversa',
                            }, {
                                value: 'column',
                                name: 'Coluna',
                                title: 'Coluna',
                                className: 'icons-flex icon-dir-col fa-solid fa-arrow-down-long',
                            }, {
                                value: 'column-reverse',
                                name: 'Coluna reversa',
                                title: 'Coluna reversa',
                                className: 'icons-flex icon-dir-col-rev fa-solid fa-retweet',
                            }],
                        }, {
                            name: 'Justificado',
                            property: 'justify-content',
                            type: 'radio',
                            defaults: 'flex-start',
                            list: [{
                                value: 'flex-start',
                                className: 'icons-flex icon-just-start fa-solid fa-align-left',
                                title: 'Começo',
                            }, {
                                value: 'flex-end',
                                title: 'Final',
                                className: 'icons-flex icon-just-end fa-solid fa-align-right',
                            }, {
                                value: 'space-between',
                                title: 'Espaço entre',
                                className: 'icons-flex icon-just-sp-bet  fa-solid fa-outdent',
                            }, {
                                value: 'space-around',
                                title: 'Espaço em volta',
                                className: 'icons-flex icon-just-sp-ar fa-solid fa-indent',
                            }, {
                                value: 'center',
                                title: 'Centro',
                                className: 'plc-icons-flex icon-just-sp-cent fa-solid fa-align-center',
                            }],
                        }, {
                            name: 'Alinhamento',
                            property: 'align-items',
                            type: 'radio',
                            defaults: 'center',
                            list: [{
                                value: 'flex-start',
                                title: 'Start',
                                className: 'icons-flex icon-al-start fa-solid fa-chevron-left',
                            }, {
                                value: 'flex-end',
                                title: 'End',
                                className: 'icons-flex icon-al-end fa-solid fa-chevron-right',
                            }, {
                                value: 'stretch',
                                title: 'Stretch',
                                className: 'icons-flex icon-al-str fa-solid fa-arrows-up-down-left-right',
                            }, {
                                value: 'center',
                                title: 'Center',
                                className: 'icons-flex icon-al-center fa-solid fa-arrows-to-circle',
                            }],
                        }, {
                            name: 'Flex filho',
                            property: 'label-parent-flex',
                            type: 'integer',
                        }, {
                            name: 'Ordem',
                            property: 'order',
                            type: 'integer',
                            defaults: 0,
                            min: 0
                        }, {
                            name: 'Flex',
                            property: 'flex',
                            type: 'composite',
                            properties: [{
                                name: 'Grow',
                                property: 'flex-grow',
                                type: 'integer',
                                defaults: 1,
                                min: 0
                            }, {
                                name: 'Shrink',
                                property: 'flex-shrink',
                                type: 'integer',
                                defaults: 1,
                                min: 0
                            }, {
                                name: 'Basis',
                                property: 'flex-basis',
                                type: 'integer',
                                units: ['px', '%', ''],
                                unit: '',
                                defaults: '1',
                            }],
                        }, {
                            name: 'Alinhamento Individual',
                            property: 'align-self',
                            type: 'radio',
                            defaults: 'auto',
                            list: [{
                                value: 'auto',
                                name: 'Auto',
                            }, {
                                value: 'flex-start',
                                title: 'Start',
                                className: 'icons-flex icon-al-start fa-solid fa-chevron-left',
                            }, {
                                value: 'flex-end',
                                title: 'End',
                                className: 'icons-flex icon-al-end fa-solid fa-chevron-right',
                            }, {
                                value: 'stretch',
                                title: 'Stretch',
                                className: 'icons-flex icon-al-str fa-solid fa-arrows-up-down-left-right',
                            }, {
                                value: 'center',
                                title: 'Center',
                                className: 'icons-flex icon-al-center fa-solid fa-arrows-to-circle',
                            }],
                        }]
                    },
                ],
              },
                        
            pluginsOpts: {
                'grapesjs-custom-code': {
                    modalTitle: 'Insira seu código',
                    buttonLabel: 'Salvar'
                },

                'grapesjs-tui-image-editor': {
                    config: {
                        includeUI: {
                            initMenu: 'filter',
                        },
                    },
                    icons: {
                        'menu.normalIcon.path': `/builder/plugins/tui-image/icon-d.svg`,
                        'menu.activeIcon.path': `/builder/plugins/tui-image/icon-b.svg`,
                        'menu.disabledIcon.path': `/builder/plugins/tui-image/icon-a.svg`,
                        'menu.hoverIcon.path': `/builder/plugins/tui-image/icon-c.svg`,
                        'submenu.normalIcon.path': `/builder/plugins/tui-image/icon-d.svg`,
                        'submenu.activeIcon.path': `/builder/plugins/tui-image/icon-c.svg`,
                    },
                    script: [
                        'https://uicdn.toast.com/tui.code-snippet/v1.5.2/tui-code-snippet.min.js',
                        'https://uicdn.toast.com/tui-color-picker/v2.2.7/tui-color-picker.min.js',
                        'https://uicdn.toast.com/tui-image-editor/v3.15.2/tui-image-editor.min.js',
                    ],
                    style: [
                        'https://uicdn.toast.com/tui-color-picker/v2.2.7/tui-color-picker.min.css',
                        'https://uicdn.toast.com/tui-image-editor/v3.15.2/tui-image-editor.min.css',
                    ],
                },

                'grapesjs-preset-webpage': {
                    selectorManager: { label: "Selecione um estado", selected: "Selecioanda", emptyState: "-- Estado normal --", states: { hover: "Ao passar o mouse", active: "Clicado", "nth-of-type(2n)": "Par/Ímpar" } },
                    styleManager: {
                        empty: 'Selecione um elemento para usar o Gerenciador de Estilos',
                        textNoElement: 'Selecione um elemento para usar o Gerenciador de Estilos',
                        sectors: [{
                            name: 'Tradução',
                            open: false,
                            buildProps: ['float', 'display', 'position', 'top', 'right', 'left', 'bottom'],
                            properties: [
                                {
                                    name: 'Alinhamento',
                                    property: 'float',
                                    type: 'select',
                                    defaults: 'none',
                                    list: [
                                        { value: 'none', className: 'fa fa-times' },
                                        { value: 'left', className: 'fa fa-align-left' },
                                        { value: 'right', className: 'fa fa-align-right' }
                                    ],
                                },
                                {
                                    property: 'position',
                                    type: 'select',
                                    defaults: 'static',
                                    list: [
                                        { value: 'static', name: 'Padrão' },
                                        { value: 'relative', name: 'Relativo' },
                                        { value: 'absolute', name: 'Absoluto' },
                                        { value: 'fixed', name: 'Fixo' }
                                    ],
                                }

                         ],
                       }],
                    },
                    textCleanCanvas: 'Deseja realmente limpar a área de trabalho?',
                    blocks: ['link-block', 'quote', 'text-basic'],
                    modalImportTitle: "Importação de HTML",
                    showStylesOnChange: true,
                    modalImportLabelF: '<div style="margin-bottom: 10px; font-size: 14px;">Cole aqui seu HTML/CSS e clique em importar</div>',
                    modalImportContent: function (editor) {
                        return editor.getHtml() + '<style>' + editor.getCss() + '</style>'
                    },
                    modalImportButton: "Importar",
                    filestackOpts: null, //{ key: 'AYmqZc2e8RLGLE7TGkX3Hz' },
                    aviaryOpts: false,
                    blocksBasicOpts: { flexGrid: 1 },
                },
            },

            
            blockManager: {
                //appendTo: '#blocksMgr',
                blocks: $this.arrBlocksTreated
            },
            canvas: {
                scripts: [
                    '/analytics/js/builder-vars-analytics',
                    '/js/analytics.js',
                    '/js/builder_load_analytics.js'         
                ],
                styles: [
                    // '/css/builder/bootplices.css',
                    '/css/builder/styleplices.css',
                    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css'
                    
                ]
            },                        
        });
        
        // Adiciona os blocos definidos

        // Remove os blocos desnecessários
        $this.removeBlocks();

        $this.editor.I18n.addMessages({
            pt: {
                styleManager: {
                    properties: {
                        'background-repeat': 'Repetir',
                        'background-position': 'Posição',
                        'background-attachment': 'Attachment',
                        'background-size': 'Tamanho',
                    }
                },
            }
        });

        var panelConfig = $this.editor.Panels.addPanel({
            id: 'devices-c'
        });

        var strButton = '';

        if (['page', 'email'].includes($this.strType)) {
            strButton += ` <button id="buttonConfig" class="btn-builder-01" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasConfig" aria-controls="offcanvasConfig"><i class="fa-solid fa-gear"></i> configurar versão A</button>`
        }

        if (['page'].includes($this.strType)) {
            strButton += ` <button id="buttonCode" data-number="" class="btn-builder-01" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasCode" aria-controls="offcanvasCode"><i class="fa-solid fa-laptop-code"></i> Traking/Pixels Versão A</button>`
            strButton += ` <button id="buttonCode" data-number="" class="btn-builder-01" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasCode" aria-controls="offcanvasCode"><i class="fa-solid fa-laptop-code"></i> Traking/Pixels Versão A</button> `
        }

        if (['page', 'email'].includes($this.strType)) {
            strButton += ` <button id="buttonModel" data-number="" class="btn-builder-01" type="button" data-bs-toggle="modal" data-bs-target="#modelModal" aria-controls="modelModal" onclick="` + this.strPageObjectName + `.newModel()"><i class="fa-regular fa-floppy-disk"></i> Salvar modelo A</button>`
            strButton += ` <button id="buttonBlock" data-number="" class="btn-builder-01" type="button" data-bs-toggle="modal" data-bs-target="#blockModal" aria-controls="blockModal" onclick="` + this.strPageObjectName + `.newBlock()"><i class="fa-regular fa-floppy-disk"></i> Salvar bloco A</button> `
        };

        if (strButton != '') {
            panelConfig.get('buttons').add([{
                position: 'prepend',
                attributes: {
                    title: 'Configurações',
                    onclick: "",
                },
                context: 'toggle-rulers', //prevents rulers from being toggled when another views-panel button is clicked 
                label: strButton,
                id: 'config-modal',

            }]);
        }

        if (this.booEnableAssistant) {

            // $('#btn-chatWithPlixel').show()

            panelConfig.get('buttons').add([{
                position: 'prepend',
                attributes: {
                    title: 'Assistente de conteúdo',
                    onclick: "",
                },
                context: 'toggle-rulers', //prevents rulers from being toggled when another views-panel button is clicked 
                label: `<button id="aiAssistantBtn" data-number="" type="button" style="display:none;" class="btn-builder-02" onclick="$('#btn-chatWithPlixel').click()"> <img src="http://res.cloudinary.com/blocomposer/image/upload/v1684943727/blocomposer/u96cvmzj1oi7bhqswa3b.png" alt="">&nbsp;&nbsp;&nbsp;Precisa de ajuda?</button>`,
                id: 'config-modal',
            }]);
        }

        const pn = $this.editor.Panels;
        const panelViews = pn.addPanel({
            id: 'options'
        });

        panelViews.get('buttons').add([{
            attributes: {
                title: 'Réguas laterais'
            },
            context: 'toggle-rulers', //prevents rulers from being toggled when another views-panel button is clicked 
            label: `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M.2 468.9C2.7 493.1 23.1 512 48 512l96 0 320 0c26.5 0 48-21.5 48-48l0-96c0-26.5-21.5-48-48-48l-48 0 0 80c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-80-64 0 0 80c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-80-64 0 0 80c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-80-80 0c-8.8 0-16-7.2-16-16s7.2-16 16-16l80 0 0-64-80 0c-8.8 0-16-7.2-16-16s7.2-16 16-16l80 0 0-64-80 0c-8.8 0-16-7.2-16-16s7.2-16 16-16l80 0 0-48c0-26.5-21.5-48-48-48L48 0C21.5 0 0 21.5 0 48L0 368l0 96c0 1.7 .1 3.3 .2 4.9z"/></svg>`,
            command: 'ruler-visibility',
            id: 'ruler-visibility'
        }]);

        const panelViews2 = pn.addPanel({
        id: 'views'
        });
        panelViews2.get('buttons').add([{
        attributes: {
            title: 'Modificar HTML e CSS'
        },
        className: 'fa fa-terminal',
        command: 'open-code',
        togglable: false,
        id: 'open-code'
        }]);


        $.each($this.editor.BlockManager.getAll().models, function (index, value) {
            // switch (value.attributes.label.replace(/<[^>]*>?/gm, '').trim()) {
            //     case 'Text':
            //         $this.editor.BlockManager.getAll().models[index].attributes.category = 'Texto'
            //         $this.editor.BlockManager.getAll().models[index].attributes.label = 'Texto'
            //         break;

            //     default:
            //         break;
            // }




            switch (value.attributes.category.id) {
                case 'Basic':
                    $this.editor.BlockManager.getAll().models[index].attributes.category = 'Básico'

                    break;
                case 'Forms':
                    $this.editor.BlockManager.getAll().models[index].attributes.category = 'Formulário'

                    break;
                case '':
                case 'Extra':
                    $this.editor.BlockManager.getAll().models[index].attributes.category = 'Outros'

                    break;
                default:
                    break;
            }




            // if (['column1', 'column2', 'column3', 'column3-7', 'tabs'].includes(value.attributes.id)) {
            //     $this.editor.BlockManager.getAll().models[index].attributes.category = 'Layout';
            // }

            if (['lory-slider', 'custom-code', 'countdown', 'tooltip'].includes(value.attributes.id)) {
                $this.editor.BlockManager.getAll().models[index].attributes.category = 'Outros';
            }

            if (['image', 'video'].includes(value.attributes.id)) {
                $this.editor.BlockManager.getAll().models[index].attributes.category = 'Mídia';
            }

            if (['button', 'radio', 'checkbox', 'label', 'select', 'textarea', 'input', 'form'].includes(value.attributes.id)) {
                $this.editor.BlockManager.getAll().models[index].attributes.category = 'Formulário';
            }

            if (['sect100', 'sect50', 'sect30', 'sect37', 'flexbox'].includes(value.attributes.id)) {
                $this.editor.BlockManager.getAll().models[index].attributes.category = 'Seção';
            }

        });


        $this.editor.on('block:drag:start', function (model) {
            if (model != undefined && model != null) {
                var strMetadataName = model.getId().replace('field_', '');
                if (strMetadataName != null) {

                    if ($this.editor.getHtml().indexOf('name="' + strMetadataName + '"') > 0) {
                        Swal.fire({
                            title: ('Campo já inserido'),
                            html: ('O campo já faz parte do formulário.'),
                            timer: 5000,
                            showCloseButton: false,
                            type: 'error',
                        })
                    }

                }
            }

            $('.gjs-btn-import__custom-code').attr('type', 'button')

            return false;

        });

        $this.editor.on('component:selected', function () {
            var selectedBlock = $this.editor.getSelected();
            var selectedBlockEl = selectedBlock.view.el;
            var parser = new DOMParser()
            var doc = parser.parseFromString($this.editor.getHtml(), "text/html")
            var searchId = doc.getElementById(selectedBlockEl.id);
            var strType = selectedBlockEl.tagName.toLowerCase();

            if (selectedBlockEl) {

                // $('#btn-chatWithPlixel').attr('onclick', 'assistant.assistant()')

                $('#btn-chatWithPlixel').show();

                $('#aiAssistantBtn').show();

                // Verifica se a div já está visível
                var div = document.getElementById('chatWithPlixel');

                if (div && $("#aiShowMessagesTemplate").html() != undefined) {
                    var style = window.getComputedStyle(div);
                    var isVisible = style.display !== 'none' && style.visibility !== 'hidden';
                    if (!isVisible) {
                        // Se não estiver, compila o conteúdo
                        view.compile(
                            $("#aiShowMessagesTemplate").html(),
                            "#aiShowMessages"
                        );
                    }

                    if (searchId) {
                        $('#btn-chatWithPlixel').show();
                        $('#aiAssistantBtn').show();
                    } else {
                        $('#btn-chatWithPlixel').hide();
                        $('#aiAssistantBtn').hide();
                    }

                    if (strType == 'img') {
                        $(selectedBlockEl).on('dblclick', function () {
                            $('.gjs-mdl-container').hide();
                            cmsUploadImage.open();
                        })
                    }
                }
            }

            $('.gjs-sm-properties').show();
        });

        $this.editor.on('block:drag:stop', function (model) {

            if (model != undefined && model != null && typeof model.getAttributes === 'function') {
                if ($this.editor.getHtml().indexOf('plices-form') > 0 && model.getAttributes()['form-code'] != null && model.getAttributes()['form-code'] != undefined) {
                    //$this.editor.render();
                }
            }
        });

        return Promise.resolve();
    }

    async behavior() {
        var $this = this;

        $('span[title="Open Layer Manager"]').attr('id', 'openLayerManager');
        $('span[title="Open Blocks"]').attr('id', 'openBlocks');
        $('span[title="Open Style Manager"]').attr('id', 'openStyleManager');
        $('span[title="View components"]').attr('id', 'viewComponents');

        if ($('#openBlocks').hasClass('gjs-pn-active') == false) {
            $('#openBlocks').click();
        }

        $('#viewComponents').click();

        $('#viewComponents').addClass('fa-regular');

        $('#viewComponents').click(function () {
            $('#viewComponents').addClass('fa-regular');
        });


        $('#gjs-clm-states option[value=""]').text('--Estado normal--');
        $('#gjs-clm-states option[value=hover]').text('Ao passar o mouse');
        $('#gjs-clm-states option[value=active]').text('Clicado');
        $("#gjs-clm-states option[value='nth-of-type(2n)']").text('Par/Ímpar');


        $(".gjs-sm-property__border-top-left-radius .gjs-sm-icon ").html('Topo esquerdo');
        $(".gjs-sm-property__border-top-right-radius .gjs-sm-icon ").html('Topo direito');
        $(".gjs-sm-property__border-bottom-left-radius .gjs-sm-icon ").html('Fundo esquerdo');
        $(".gjs-sm-property__border-bottom-right-radius .gjs-sm-icon ").html('Fundo direito');

        $(".gjs-sm-property__border-width .gjs-sm-icon ").html('Largura');
        $(".gjs-sm-property__border-style .gjs-sm-icon ").html('Estilo');
        $(".gjs-sm-property__border-color .gjs-sm-icon ").html('Cor');

        $('.gjs-sm-sector-title.gjs-sm-title').find('.gjs-sm-sector-label').html(__('Configurações'));

        $('.gjs-placeholder-int').html('<span class="gjs-placeholder-int-span">' + ('Solte  aqui!') + '</span>')
        $('.gjs-com-placeholder-int').html('<span class="gjs-placeholder-int-span">' + ('Solte aqui!') + '</span>')
        $('.gjs-placeholder-int').html('<span class="gjs-placeholder-int-span">' + __('Solte aqui!') + '</span>')


        //$this.editor.DomComponents.removeType('input');
    }


}

class PageBuilder extends Builder {
    /**
     * Tipo de editor
     */
    strType = 'page';

    /**
     * Plugins utilizados
     */
    arrPlugins = [
        'grapesjs-preset-webpage',
        'grapesjs-tui-image-editor',
        'grapesjs-style-filter',
        'grapesjs-custom-code',
        'grapesjs-tooltip',
        'grapesjs-touch',
        'grapesjs-component-countdown',
        'grapesjs-rte-extensions',
        'grapesjs-rulers',
        'grapesjs-plugin-toolbox',
        //'grapesjs-animations',
        'grapesjs-style-bg',
        'grapesjs-plugin-traits',
        'grapesjs-parser-postcss',
        'grapesjs-component-code-editor'
    ];

    /**
     * Blocos nativos ou dos plugins que devem ser removidos
     */
    arrRemoveBlocks = [
        'column1', 'column2', 'column3', 'column3-7',
        'tabs', 'css-grid', 'css-grid',
        'image', 'video', 'text',  'quote', 'flexbox', 'text-basic', 'map',
        'button', 'radio', 'checkbox', 'label', 'select', 'textarea', 'input', 'form',
        'countdown', 'h-navbar', 'link-block'
    ];

    /**
     * Blocos customizados definidos em defineBlocks()
     * Os blocos serão apresentados na ordem em que aparecem, respeitando a categoria
     * As categorias são mostradas na ordem do primeiro bloco da categoria que aparece
     */
    arrEnabledBlocks = [
        //'button-form',
        'chatgpt-content', 'chatgpt-image',
        'section-ini', 'h1', 'h2',
        'text', 'link', 'link-block', 'p', 'list', 'quote', 'btn-plices',
        'custom-collumn-1', 'custom-collumn-2', 'custom-collumn-2b', 'custom-collumn-2c', 'custom-collumn-3', 'custom-collumn-3b', 'separator',
        'video-01',
        'image-01',
        'plices-map',
        'button-1', 'button-2', 'button-3', 'button-4', 'button-5', 'button-6', 'button-7',
    ];

    /**
     * Carrega os campos do cadastro de campos
     */
    booEnableFields = false;

    /**
     * Elementos das páginas
     */
    booPageElements = true;

    /**
     * Elementos dos e-mails
     */
    booEmailElements = true;

    /**
     * Elementos dos forms
     */
    booFormElements = true

    /**
     * Formulários criados na Plices
     */
    booFormsPlices = true;

    /**
     * Define se deve mostrar os blocos salvos pelo usuário
     */
    booEnablePageBlocks = true;

    /**
     * Define se deve mostrar os blocos de e-mail salvos pelo usuário
     */
    booEnableEmailBlocks = false;

    /**
     * Habilita o assistente de inteligência do chat gpt
     */
    booEnableAssistant = true;

    /**
     * Tipo de assitente do chat gpt
     */
    strAssistantType = 'page';

    async behavior() {
        super.behavior();

    }

}

class FormBuilder extends Builder {
    /**
     * Tipo de editor
     */
    strType = 'form';
    /**
     * Plugins utilizados
     */
    arrPlugins = [
        'grapesjs-preset-webpage',
        'grapesjs-tui-image-editor',
        'grapesjs-style-filter',
        'grapesjs-touch',
        'grapesjs-rte-extensions',
        'grapesjs-rulers',
        'grapesjs-plugin-toolbox',
        'grapesjs-plugin-traits',
        'grapesjs-parser-postcss',
        'grapesjs-component-code-editor'
    ];

    /**
     * Blocos nativos ou dos plugins que devem ser removidos
     */
    arrRemoveBlocks = [
        'column1', 'column2', 'column3', 'column3-7',
        'tabs', 'css-grid', 'css-grid',
        'image', 'video', 'text', 'quote', 'flexbox', 'text-basic', 'map',
        'button', 'radio', 'checkbox', 'label', 'select', 'textarea', 'input', 'form',
        'countdown', 'h-navbar', 'link-block'
    ];

    /**
     * Blocos customizados definidos em defineBlocks()
     * Os blocos serão apresentados na ordem em que aparecem, respeitando a categoria
     * As categorias são mostradas na ordem do primeiro bloco da categoria que aparece
     */
    arrEnabledBlocks = [
        'button-form',
        'custom-collumn-1', 'custom-collumn-2', 'custom-collumn-2b', 'custom-collumn-2c', 'custom-collumn-3', 'custom-collumn-3b', 'separator',
        'section-ini', 'h1', 'h2','text',
        'text', 'link', 'link-block', 'p', 'list', 'quote', 'btn-plices',
        'video-01',
        'image-01',
    ];

    /**
     * Carrega os campos do cadastro de campos
     */
    booEnableFields = true;

    /**
     * Elementos das páginas
     */
    booPageElements = false;

    /**
     * Elementos dos e-mails
     */
    booEmailElements = false;

    /**
     * Elementos dos forms
     */
    booFormElements = true;
    /**
     * Formulários criados na Plices
     */
    booFormsPlices = false;

    /**
     * Define se deve mostrar os blocos salvos pelo usuário
     */
    booEnablePageBlocks = false;

    /**
     * Define se deve mostrar os blocos de e-mail salvos pelo usuário
     */
    booEnableEmailBlocks = false;

    /**
     * Habilita o assistente de inteligência do chat gpt
     */
    booEnableAssistant = true;

    /**
     * Tipo de assitente do chat gpt
     */
    strAssistantType = 'form';

    async behavior() {
        super.behavior();

        // $('span[title="View code"]').attr('id', 'viewCode');
        //$('#viewCode').remove();
        //$(".gjs-pn-btn.fa.fa-download").remove();
    }

}

class EmailBuilder extends Builder {

    /**
     * Tipo de editor
     */
    strType = 'email';
    /**
     * Plugins utilizados
     */
    arrPlugins = [
        'grapesjs-preset-webpage',
        'grapesjs-tui-image-editor',
        'grapesjs-blocks-flexbox',
        'grapesjs-style-filter',
        'grapesjs-tabs',
        'grapesjs-custom-code',
        'grapesjs-tooltip',
        'grapesjs-touch',
        //'grapesjs-lory-slider',
        'grapesjs-component-countdown',
        'grapesjs-rte-extensions',
        'grapesjs-ga',
        'grapesjs-rulers',
        'grapesjs-plugin-toolbox',
        'grapesjs-plugin-traits',
        'grapesjs-parser-postcss',
        'grapesjs-component-code-editor'
    ];

    /**
     * Blocos nativos ou dos plugins que devem ser removidos
     */
    arrRemoveBlocks = [
        'column1', 'column2', 'column3', 'column3-7',
        'tabs', 'css-grid', 'css-grid',
        'image', 'video', 'text', 'quote', 'flexbox', 'text-basic', 'map',
        'button', 'radio', 'checkbox', 'label', 'select', 'textarea', 'input', 'form',
        'countdown', 'h-navbar', 'link-block'
    ];

    /**
     * Blocos customizados definidos em defineBlocks()
     * Os blocos serão apresentados na ordem em que aparecem, respeitando a categoria
     * As categorias são mostradas na ordem do primeiro bloco da categoria que aparece
     */
    arrEnabledBlocks = [
        'section-ini', 'h1', 'h2',
        'text', 'link', 'link-block', 'p', 'list', 'quote', 'btn-plices',
        'custom-collumn-1', 'custom-collumn-2', 'custom-collumn-2b', 'custom-collumn-2c', 'custom-collumn-3', 'custom-collumn-3b', 'separator', 'section',
        'video-01',
        'image-01',
        'plices-map',
        'button-1', 'button-2', 'button-3', 'button-4', 'button-5', 'button-6', 'button-7',
    ];

    /**
     * Carrega os campos do cadastro de campos
     */
    booEnableFields = false;

    /**
     * Elementos das páginas
     */
    booPageElements = false;
    /**
     * Elementos dos e-mails
     */
    booEmailElements = true;

    /**
     * Elementos dos forms
     */
    booFormElements = false;
    /**
     * Formulários criados na Plices
     */
    booFormsPlices = false;

    /**
     * Define se deve mostrar os blocos de página salvos pelo usuário
     */
    booEnablePageBlocks = false;

    /**
     * Define se deve mostrar os blocos de e-mail salvos pelo usuário
     */
    booEnableEmailBlocks = true;

    /**
     * Habilita o assistente de inteligência do chat gpt
     */
    booEnableAssistant = true;

    /**
     * Tipo de assitente do chat gpt
     */
    strAssistantType = 'email';

    async behavior() {
        super.behavior();

        //$('span[title="View code"]').attr('id', 'viewCode');
        //$('#viewCode').remove();
    }


}


class PageModelBuilder extends PageBuilder {
    /**
     * Tipo de editor
     */
    strType = 'page-model';
}

class PageBlockBuilder extends PageBuilder {
    /**
     * Tipo de editor
     */
    strType = 'page-block';
}

class EmailModelBuilder extends EmailBuilder {
    /**
     * Tipo de editor
     */
    strType = 'email-model';
}

class EmailBlockBuilder extends EmailBuilder {
    /**
     * Tipo de editor
     */
    strType = 'email-block';
}

class EmailTransactionalBuilder extends EmailBuilder {
    /**
     * Tipo de editor
     */
    strType = 'email-transactional';

    strAssistantType = 'emailTransaction';
}