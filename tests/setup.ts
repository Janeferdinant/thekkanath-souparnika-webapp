import '@testing-library/jest-dom';

// jsdom has no canvas; make context creation a quiet "unsupported" instead of a logged error.
HTMLCanvasElement.prototype.getContext = (() => null) as unknown as typeof HTMLCanvasElement.prototype.getContext;
