define([
    'uiComponent',
    'jquery',
    'mage/translate',
    'Magento_Ui/js/modal/confirm',
    'Magento_Ui/js/modal/modal',
    'jquery/colorpicker/js/colorpicker'
], function (Component, $, $t, confirm) {
    'use strict';

    const SELECTORS = {
        DESIGNER_MODAL: '#gene-bettercheckout-designer',
        DESIGNER_ROOT: '#gene-better-checkout-root',
        DESIGNER_VALUES: '#gene_better_checkout_general_checkout_designer_designer_values',
        DESIGNER_VALUES_SYSTEM: `
            #gene_better_checkout_general_checkout_designer_designer_values_inherit,
            #gene_better_checkout_general_checkout_designer_custom_wording_inherit,
            #gene_better_checkout_general_checkout_designer_gene_better_checkout_logo_inherit
        `,
        CUSTOM_WORDING: '#gene_better_checkout_general_checkout_designer_custom_wording',
        DESIGNER_LOGO: '#gene_better_checkout_general_checkout_designer_gene_better_checkout_logo',
        DESIGNER_LOGO_LABEL: `
            #gene-bettercheckout-designer 
            label[for="gene_better_checkout_general_checkout_designer_gene_better_checkout_logo"]
        `,
        DESIGNER_LOGO_IMG_PREVIEW: '#gene_better_checkout_general_checkout_designer_gene_better_checkout_logo_image',
        DESIGNER_LOGO_DELETE: '#gene_better_checkout_general_checkout_designer_gene_better_checkout_logo_delete'
    };

    return Component.extend({
        initialize: function (config, element) {
            this.config = config;
            this.cacheElements();
            this.enableLogo();
            this.bindEvents(element);
        },

        cacheElements: function () {
            this.designerModal = $(SELECTORS.DESIGNER_MODAL);
            this.designerValues = $(SELECTORS.DESIGNER_VALUES);
            this.designerValuesSystem = $(SELECTORS.DESIGNER_VALUES_SYSTEM);
            this.customWording = $(SELECTORS.CUSTOM_WORDING);
            this.designerLogo = $(SELECTORS.DESIGNER_LOGO);
            this.designerLogoLabel = $(SELECTORS.DESIGNER_LOGO_LABEL);
            this.designerLogoImgPreview = $(SELECTORS.DESIGNER_LOGO_IMG_PREVIEW);
            this.designerLogoDelete = $(SELECTORS.DESIGNER_LOGO_DELETE);
        },

        enableLogo: function () {
            this.designerLogo.prop('disabled', false);
            this.designerLogo.insertAfter(this.designerLogoLabel);
        },

        bindEvents: function (element) {
            this.designerModal.modal({
                buttons: [
                    { text: $t('Reset'), click: this.resetDesigner.bind(this) },
                    { text: $t('Cancel'), click: this.closeModal.bind(this) },
                    { text: $t('Save'), click: this.saveDesigner.bind(this) }
                ],
                modalClass: 'gene-bettercheckout-designer-modal'
            });

            this.designerModal.find('input').on('input change keyup', this.triggerChange.bind(this));
            this.designerModal.find('.toggle').on('click', this.toggleSidebar.bind(this));
            this.designerValues.on('change', this.setSystemValue.bind(this));
            this.customWording.on('change', this.setSystemValue.bind(this));

            document.addEventListener('gene-better-checkout-loaded', () => {
                this.loadInitialLogo();
                this.initializePixelInputs();
                this.loadInitialCSSValues();
                this.loadInitialWordingValues();
                this.setupColorPickers();
            });

            document.addEventListener('switchDeviceType', this.handleSwitchDeviceType.bind(this));
            document.addEventListener('switchDisplayedStep', this.handleSwitchDisplayedStep.bind(this));

            $(element).on('click', this.openDesigner.bind(this));
        },

        toggleSidebar: function () {
            this.designerModal.toggleClass('open');
        },

        triggerChange: function (event) {
            if (event.target.type === 'file') {
                this.handleFileInputChange(event.target);
            } else if (event.target.dataset.type === 'checkout-wording') {
                this.dispatchTextChangeEvent(event.target.value, event.target.id);
            } else {
                this.setCSSVariable(event.target.dataset.cssVariable, event.target.value);
            }
        },

        handleFileInputChange: function (input) {
            if (input.files && input.files.length) {
                let reader = new FileReader();

                reader.onload = () => this.dispatchLogoChangeEvent(reader.result);
                reader.readAsDataURL(input.files[0]);
            } else {
                this.dispatchLogoChangeEvent();
            }
        },

        dispatchLogoChangeEvent: function (src) {
            const event = new CustomEvent('gene:checkout-image-update', { detail: src });

            document.dispatchEvent(event);
            window.geneCheckout = window.geneCheckout || {};
            window.geneCheckout.logo = src;
        },

        dispatchTextChangeEvent: function (value, customEventId) {
            const event = new CustomEvent(customEventId, { detail: value });

            document.dispatchEvent(event);
            window.geneCheckout = window.geneCheckout || {};
            window.geneCheckout[customEventId] = value;
        },

        setCSSVariable: function (name, value) {
            $(SELECTORS.DESIGNER_ROOT).get(0).style.setProperty(name, value);
        },

        handleSwitchDeviceType: function (event) {
            let deviceType = event.detail,

                // Define mappings for device types to specific fields
                deviceToFieldMap = {
                    'MockMobile': '.mobile-specific-field',
                    'MockTablet': '.mobile-specific-field',
                    'MockLaptop': '.desktop-specific-field',
                    'MockDesktop': '.desktop-specific-field',
                    'MockFull': '.mobile-specific-field, .desktop-specific-field'
                };

            // Hide all specific fields by default
            $('.mobile-specific-field, .desktop-specific-field').hide();

            // Show specific field based on the device type
            $(deviceToFieldMap[deviceType]).show();
        },

        handleSwitchDisplayedStep: function (event) {
            let checkoutStep = event.detail,

                // Define mappings for step to specific fields
                stepToFieldMap = {
                    'YourDetails': '.details-specific-field',
                    'Shipping': '.shipping-specific-field',
                    'Payment': '.payment-specific-field'
                };

            // Hide all specific fields by default
            $('.details-specific-field, .shipping-specific-field, .payment-specific-field').hide();

            // Show specific field based on the checkout step
            $(stepToFieldMap[checkoutStep]).show();
        },

        openDesigner: function (event) {
            event.preventDefault();
            this.loadScriptIfNeeded();
            this.designerModal.modal('openModal');
        },

        loadScriptIfNeeded: function () {
            let scriptId = 'personalisation-editor-js-app',
                existingScript = document.getElementById(scriptId);

            if (!existingScript) {
                let scriptSrc = this.config.jsAssets[0],
                    scriptEl = document.createElement('script');

                scriptEl.type = 'text/javascript';
                scriptEl.async = true;
                scriptEl.src = scriptSrc;
                scriptEl.id = scriptId;
                document.head.appendChild(scriptEl);
            }
        },

        loadInitialLogo: function () {
            if (this.designerLogoImgPreview.attr('src')) {
                window.geneCheckout = window.geneCheckout || {};
                window.geneCheckout.logo = this.designerLogoImgPreview.attr('src');
            }
        },

        initializePixelInputs: function () {
            this.designerModal.find('.pixel-input').each(function (index, element) {
                // Find the related hidden text input for each number input
                var hiddenTextInput = $('#' + element.id + '_hidden');

                $(element).on('change', function () {
                    var inputValue = $(this).val(),

                        valueWithPx = inputValue + 'px';

                    // Set the value of the hidden text input to valueWithPx
                    hiddenTextInput.val(valueWithPx).trigger('change');
                });
            });

            this.designerModal.find('.pixel-input + input').each(function (index, element) {
                // Get the visible part and remove 'px'.
                var visibleTextInput = $(`#${element.id.replace('_hidden', '')}`);

                $(element).on('change', function () {
                    var inputValue = $(this).val(),

                        valueWithoutPx = inputValue.replace('px', '');

                    // Set the value of the hidden text input to valueWithoutPx
                    visibleTextInput.val(valueWithoutPx);
                });
            });
        },

        loadInitialCSSValues: function () {
            const cssValues = this.designerValues.val().split(';');

            cssValues.forEach(function (value) {
                const [name, cssValue] = value.split(':');

                this.triggerChange({
                    target: {
                        dataset: {
                            cssVariable: name
                        },
                        value: cssValue
                    }
                });

                $(`[data-css-variable="${name}"]`).val(cssValue).trigger('change');
            }.bind(this));
        },

        loadInitialWordingValues: function () {
            const wordingValues = this.customWording.val(),
                parsedWordingValues = wordingValues ? JSON.parse(wordingValues) : {};

            Object.keys(parsedWordingValues).forEach(function (key) {
                this.triggerChange({
                    target: {
                        dataset: {
                            type: 'checkout-wording'
                        },
                        value: wordingValues[key],
                        id: key
                    }
                });

                $(`#${key}`).val(parsedWordingValues[key]).trigger('change');
            }.bind(this));
        },

        setupColorPickers: function () {
            const designerValuesArray = this.designerValues.val().split(';');

            this.designerModal.find('[data-type="color-picker"]').each((index, element) => {
                const cssVariable = $(element).data('css-variable'),
                    swatchId = cssVariable + '-swatch',
                    defaultValue = $(element).attr('placeholder'),
                    savedValue = designerValuesArray.find(item => item.split(':')[0] === cssVariable),
                    setSwatchColor = color => {
                        $('#' + swatchId).css('background-color', color);
                    };

                // If saved value is found, set swatch colour to that otherwise set to placeholder value
                savedValue ? setSwatchColor(savedValue.split(':')[1]) : setSwatchColor(defaultValue);

                $(element).ColorPicker({
                    onChange: function (hsb, hex) {
                        $(element).val('#' + hex).trigger('change');
                        setSwatchColor('#' + hex);
                    },

                    onShow: function () {
                        $(element).ColorPickerSetColor($(element).val());
                    }
                });

                // Update swatch color when input is typed in
                $(element).on('input', function () {
                    const inputValue = $(element).val(),
                        colorToSetSwatch = inputValue ? inputValue : defaultValue;

                    setSwatchColor(colorToSetSwatch);
                });
            });
        },

        resetDesigner: function () {
            confirm({
                content:
                    $t('Clicking OK will reset all values back to their default values. This action cannot be undone.'),
                actions: {
                    confirm: function () {
                        this.designerModal.find('input').each(function (index, input) {
                            $(input).val('').trigger('change');
                        });
                        this.designerLogoDelete.trigger('click');
                        this.designerValues.val('').trigger('change');
                        this.setupColorPickers();
                    }.bind(this)
                }
            });
        },

        setSystemValue: function () {
            const value = this.designerValues.val() || this.customWording.val() || this.designerLogo.val(),
                systemValue = this.designerValuesSystem.prop('checked');

            if (value && systemValue || !value && !systemValue) {
                this.designerValuesSystem.trigger('click');
            }
        },

        saveDesigner: function () {
            this.saveImages();
            this.saveColors();
            this.saveWording();
            this.closeModal();
        },

        saveImages: function () {
            this.designerLogo.prependTo(`
            #row_gene_better_checkout_general_checkout_designer_gene_better_checkout_logo .value
            `);
        },

        saveColors: function () {
            const cssValues = this.designerModal.find('.section-config input[data-css-variable]').map(function () {
                return this.value ? `${this.dataset.cssVariable}:${this.value}` : '';
            }).toArray().filter(value => value).join(';');

            this.designerValues.val(cssValues).trigger('change');
        },

        saveWording: function () {
            const wordingValues = this.designerModal.find('.section-config input[data-type="checkout-wording"]')
                    .toArray()
                    .reduce((prev, curr) => {
                        if (!curr.value) {return prev;}
                        return { ...prev, [curr.id]: curr.value };
                    }, {}),

                storedWordingValue = Object.keys(wordingValues).length ? JSON.stringify(wordingValues) : '';

            this.customWording.val(storedWordingValue).trigger('change');
        },

        closeModal: function () {
            this.designerModal.modal('closeModal');
        }
    });
});
