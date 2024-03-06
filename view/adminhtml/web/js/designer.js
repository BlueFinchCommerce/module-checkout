define([
    'uiComponent',
    'jquery',
    'mage/translate',
    'Magento_Ui/js/modal/confirm',
    'Magento_Ui/js/modal/modal',
    'jquery/colorpicker/js/colorpicker'
], function (Component, $, $t, confirm) {
    'use strict';
    return Component.extend({
        initialize: function (config, element) {
            this.config = config;
            this.designerModal = $('#gene-bettercheckout-designer');
            this.designerRoot = $('#gene-better-checkout-root');

            this.designerValues = $('#gene_better_checkout_general_designer_values');
            this.designerValuesSystem = $(`#gene_better_checkout_general_designer_values_inherit,
                #gene_better_checkout_general_custom_wording_inherit,
                #gene_better_checkout_general_gene_better_checkout_logo_inherit`);

            this.customWording = $('#gene_better_checkout_general_custom_wording');

            this.designerLogo = $('#gene_better_checkout_general_gene_better_checkout_logo');
            this.designerLogoImgPreview = $('#gene_better_checkout_general_gene_better_checkout_logo_image');
            this.designerLogoDelete = $('#gene_better_checkout_general_gene_better_checkout_logo_delete');

            // Remove the 'disabled' attribute from the designerLogo input
            this.designerLogo.prop('disabled', false);
            this.designerLogo.insertAfter(`#gene-bettercheckout-designer
                label[for="gene_better_checkout_general_gene_better_checkout_logo"]`);

            this.designerModal.modal({
                buttons: [
                    {
                        text: $t('Reset'),
                        click: this.resetDesigner.bind(this)
                    },
                    {
                        text: $t('Cancel'),
                        click: function () {
                            this.closeModal();
                        }
                    },
                    {
                        text: $t('Save'),
                        click: this.saveDesigner.bind(this)
                    }
                ],
                modalClass: 'gene-bettercheckout-designer-modal'
            });

            this.designerModal.find('input').on('change keyup', this.triggerChange.bind(this));
            this.designerModal.find('.toggle').on('click', this.toggleSidebar.bind(this));
            this.designerValues.on('change', this.setSystemValue.bind(this));
            this.customWording.on('change', this.setSystemValue.bind(this));

            $(element).on('click', this.openDesigner.bind(this));

            document.addEventListener('switchDeviceType', this.handleSwitchDeviceType.bind(this));
            document.addEventListener('switchDisplayedStep', this.handleSwitchDisplayedStep.bind(this));
        },

        triggerChange: function (event) {
            // If the input is an image field we need to do something a little different to get the value.
            if (event.target.type === 'file') {
                if (event.target.files?.length) {
                    let reader = new FileReader();

                    reader.onload = function (e) {
                        this.dispatchLogoChangeEvent(e.target.result);
                    }.bind(this);
                    reader.readAsDataURL(event.target.files[0]);
                } else {
                    this.dispatchLogoChangeEvent();
                }

            } else if (event.target.dataset.type === 'checkout-wording') {
                this.dispatchTextChangeEvent(event.target.value, event.target.id);
            } else {
                const { dataset, value } = event.target;

                this.designerRoot.get(0).style.setProperty(dataset.cssVariable, value);
            }
        },

        dispatchTextChangeEvent: function (value, customEventId) {
            const event = new CustomEvent(customEventId, {
                detail: value
            });

            document.dispatchEvent(event);
            window.geneCheckout = window.geneCheckout || {};
            window.geneCheckout[customEventId] = value;
        },

        dispatchLogoChangeEvent: function (src) {
            const event = new CustomEvent('gene:checkout-image-update', {
                detail: src
            });

            document.dispatchEvent(event);
            window.geneCheckout = window.geneCheckout || {};
            window.geneCheckout.logo = src;
        },

        toggleSidebar: function () {
            this.designerModal.toggleClass('open');
        },

        handleSwitchDeviceType: function (event) {
            var deviceType = event.detail,

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

            const cssValues = this.designerValues.val().split(';'),
                wordingValues = this.customWording.val(),
                parsedWordingValues = wordingValues ? JSON.parse(wordingValues) : {};

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

            if (this.designerLogoImgPreview.attr('src')) {
                window.geneCheckout = window.geneCheckout || {};
                window.geneCheckout.logo = this.designerLogoImgPreview.attr('src');
            }

            this.designerModal.modal('openModal');

            this.designerModal.find('[data-type="color-picker"]').each((index, element) => {
                $(element).ColorPicker({
                    onChange: function (hsb, hex) {
                        $(element).val('#' + hex).trigger('change');
                    },

                    onShow: function () {
                        $(element).ColorPickerSetColor($(element).val());
                    }
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
                    }.bind(this)
                }
            });
        },

        saveDesigner: function () {
            this.designerLogo.prependTo('#row_gene_better_checkout_general_gene_better_checkout_logo .value');

            const cssValues = this.designerModal.find('.section-config input[data-css-variable]').map(function () {
                    return this.value
                        ? `${this.dataset.cssVariable}:${this.value}`
                        : '';
                }).toArray().filter(value => value).join(';'),

                wordingValues = this.designerModal.find('.section-config input[data-type="checkout-wording"]').toArray()
                    .reduce(function (prev, curr) {
                    // Early return if the input has no value.
                        if (!curr.value) {
                            return prev;
                        }

                        return {
                            ...prev,
                            [curr.id]: curr.value
                        };
                    }, {}),

                storedWordingValue = Object.keys(wordingValues).length
                    ? JSON.stringify(wordingValues)
                    : '';

            this.designerValues.val(cssValues).trigger('change');
            this.customWording.val(storedWordingValue).trigger('change');
            this.designerModal.modal('closeModal');
        },

        setSystemValue: function (event) {
            const value = $(event.target).val(),
                systemValue = this.designerValuesSystem.prop('checked');

            if (value && systemValue || !value && !systemValue) {
                this.designerValuesSystem.trigger('click');
            }
        }
    });
});
