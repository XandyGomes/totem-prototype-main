export const TotemHeader = () => {
  return (
    <header className="w-full bg-primary py-6 px-8 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div className="w-40 h-16 bg-primary-foreground/20 rounded flex items-center justify-center border-2 border-dashed border-primary-foreground/70">
          <span className="text-xs text-primary-foreground/80 font-medium">LOGO SUS</span>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="w-40 h-16 bg-primary-foreground/20 rounded flex items-center justify-center border-2 border-dashed border-primary-foreground/70">
          <span className="text-xs text-primary-foreground/80 font-medium">LOGO PREFEITURA</span>
        </div>
      </div>
    </header>
  );
};
