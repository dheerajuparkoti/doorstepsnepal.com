export const obfuscateId = (id: number): string => {

  return Buffer.from(id.toString()).toString('base64').replace(/=/g, '');
};

export const deobfuscateId = (obfuscated: string): number => {
  try {
 
    let base64 = obfuscated;
    while (base64.length % 4) {
      base64 += '=';
    }
    return parseInt(Buffer.from(base64, 'base64').toString());
  } catch (error) {
    return NaN;
  }
};