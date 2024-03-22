import graphQlRequest from '@/services/graphQlRequest';

import useConfigStore from '@/stores/ConfigStores/ConfigStore';

import getCustomConfigs from '@/helpers/storeConfigs/getCustomConfigs';
import mapCustomConfigs from '@/helpers/storeConfigs/mapCustomConfigs';

export default async () => {
  const configStore = useConfigStore();

  const configs = [
    'base_static_url',
    'default_display_currency_code',
    'code',
    'secure_base_url',
    'use_store_in_url',
    'website_name',
    'gene_better_checkout_newsletter_enabled',
    'gene_better_checkout_newsletter_allow_guest',
    'gene_better_checkout_country_state_required',
    'gene_better_checkout_country_display_state',
    'magento_reward_general_is_enabled',
    'magento_reward_general_is_enabled_on_front',
    'optional_zip_countries',
    'tax_cart_display_price',
    'tax_cart_display_shipping',
    'tax_cart_display_full_summary',
    'gene_better_checkout_copyright_text',
    'gene_better_checkout_afd_enable',
    'gene_better_checkout_progress_bar_visible',
  ];

  if (configStore.locale) {
    configStore.setLocale(configStore.locale);
  } else {
    configs.push('locale');
  }

  const allConfigs = configs.concat(getCustomConfigs);

  const request = ` {
    storeConfig {
      ${allConfigs.join(' ')}
    }

    countries {
      id
      two_letter_abbreviation
      three_letter_abbreviation
      full_name_locale
      available_regions {
        id
        code
        name
      }
    }
  }`;

  const { data: { countries, storeConfig } } = await graphQlRequest(request);

  configStore.setData({
    staticUrl: storeConfig.base_static_url.replace(/\/+$/, ''),
    currencyCode: storeConfig.default_display_currency_code,
    storeCode: storeConfig.code,
    useStoreInUrl: storeConfig.use_store_in_url,
    websiteName: storeConfig.website_name || '',
    secureBaseUrl: storeConfig.secure_base_url,
    newsletterEnabled: storeConfig.gene_better_checkout_newsletter_enabled === '1',
    newsletterAllowGuests: storeConfig.gene_better_checkout_newsletter_allow_guest === '1',
    stateRequired: storeConfig.gene_better_checkout_country_state_required
      ? storeConfig.gene_better_checkout_country_state_required.split(',') : [],
    displayState: storeConfig.gene_better_checkout_country_display_state === '1',
    rewardsEnabled: storeConfig.magento_reward_general_is_enabled === '1'
      && storeConfig.magento_reward_general_is_enabled_on_front === '1',
    optionalZipCountries: storeConfig.optional_zip_countries || '',
    taxCartDisplayPrice: storeConfig.tax_cart_display_price === '2',
    taxCartDisplayShipping: storeConfig.tax_cart_display_shipping === '2',
    taxCartDisplayFullSummary: storeConfig.tax_cart_display_full_summary === '1',
    copyrightText: storeConfig.gene_better_checkout_copyright_text,
    afdStatus: storeConfig.gene_better_checkout_afd_enable,
    progressBarVisible: storeConfig.gene_better_checkout_progress_bar_visible === true,
  });

  if (storeConfig.locale) {
    configStore.setLocale(storeConfig.locale);
  }

  countries.sort((a, b) => a.full_name_locale.toUpperCase()
    .localeCompare(b.full_name_locale.toUpperCase()));

  configStore.setData({ countries });

  const customConfigs = await mapCustomConfigs(storeConfig);

  configStore.setData({
    custom: customConfigs,
  });
};
