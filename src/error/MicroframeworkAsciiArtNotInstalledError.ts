/**
 * Thrown when user uses logo but required ascii-art package is not installed.
 */
export class MicroframeworkAsciiArtNotInstalledError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, MicroframeworkAsciiArtNotInstalledError.prototype);

    this.name = 'MicroframeworkAsciiArtNotInstalledError';
    this.message = `To use logo option please install ascii-art package: npm i ascii-art --save`;
  }
}
