import functionExtension from '@/extensions/functionExtension';

export default async () => {
  const isVirtual = `
    is_virtual
  `;

  const [modifiedCart] = await functionExtension('geIsVirtual', [isVirtual]);

  return modifiedCart;
};
