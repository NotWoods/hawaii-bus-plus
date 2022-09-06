// @ts-expect-error missing types
import OMT from '@surma/rollup-plugin-off-main-thread';
import { Plugin } from 'vite';

export function offMainThread(): Plugin {
  const base = OMT({
    silenceESMWorkerWarning: true,
  }) as Plugin;

  return {
    ...base,
    // Don't want the regex logic
    transform: undefined,
    outputOptions(options) {
      // SSR uses cjs but the output will never run.
      // Just fake the format here.
      if (typeof base.outputOptions !== 'function') {
        throw new Error('OMT outputOptions is not a function');
      }

      return base.outputOptions.call(this, {
        ...options,
        format: options.format === 'cjs' ? 'es' : options.format,
      });
    },
  };
}
