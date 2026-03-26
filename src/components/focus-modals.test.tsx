import { fireEvent, render, screen } from "@testing-library/react";
import ColominesFocusModal from "./ColominesFocusModal";
import MarcheFocusModal from "./MarcheFocusModal";
import TerresVivantesFocusModal from "./TerresVivantesFocusModal";

type PrintWindowMock = {
  document: {
    write: ReturnType<typeof vi.fn>;
    close: ReturnType<typeof vi.fn>;
  };
  focus: ReturnType<typeof vi.fn>;
  print: ReturnType<typeof vi.fn>;
  close: ReturnType<typeof vi.fn>;
};

const createPrintWindowMock = (): PrintWindowMock => ({
  document: {
    write: vi.fn(),
    close: vi.fn(),
  },
  focus: vi.fn(),
  print: vi.fn(),
  close: vi.fn(),
});

describe("Focus modals", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("closes the Colomines modal from the close button", () => {
    const onClose = vi.fn();
    render(<ColominesFocusModal onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: /fermer/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("prints the Colomines modal content", () => {
    const printWindow = createPrintWindowMock();
    const openSpy = vi
      .spyOn(window, "open")
      .mockReturnValue(printWindow as unknown as Window);

    render(<ColominesFocusModal onClose={() => {}} />);

    fireEvent.click(
      screen.getByRole("button", { name: /imprimer \/ enregistrer en pdf/i }),
    );
    vi.advanceTimersByTime(300);

    expect(openSpy).toHaveBeenCalledWith("", "_blank");
    expect(printWindow.document.write).toHaveBeenCalled();
    expect(printWindow.document.write.mock.calls[0][0]).toContain(
      "Les Colomines : L'alternative durable pour Cabestany",
    );
    expect(printWindow.focus).toHaveBeenCalled();
    expect(printWindow.print).toHaveBeenCalled();
    expect(printWindow.close).toHaveBeenCalled();
  });

  it("closes the Marché modal from the close button", () => {
    const onClose = vi.fn();
    render(<MarcheFocusModal onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: /fermer/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("prints the Marché modal content", () => {
    const printWindow = createPrintWindowMock();
    const openSpy = vi
      .spyOn(window, "open")
      .mockReturnValue(printWindow as unknown as Window);

    render(<MarcheFocusModal onClose={() => {}} />);

    fireEvent.click(
      screen.getByRole("button", { name: /imprimer \/ enregistrer en pdf/i }),
    );
    vi.advanceTimersByTime(300);

    expect(openSpy).toHaveBeenCalledWith("", "_blank");
    expect(printWindow.document.write).toHaveBeenCalled();
    expect(printWindow.document.write.mock.calls[0][0]).toContain(
      "Marché Catalan Transfrontalier : Un événement phare pour Cabestany",
    );
    expect(printWindow.print).toHaveBeenCalled();
    expect(printWindow.close).toHaveBeenCalled();
  });

  it("closes the Pépinière modal from the close button", () => {
    const onClose = vi.fn();
    render(<TerresVivantesFocusModal onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: /fermer/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("prints the Pépinière modal content", () => {
    const printWindow = createPrintWindowMock();
    const openSpy = vi
      .spyOn(window, "open")
      .mockReturnValue(printWindow as unknown as Window);

    render(<TerresVivantesFocusModal onClose={() => {}} />);

    fireEvent.click(
      screen.getByRole("button", { name: /imprimer \/ enregistrer en pdf/i }),
    );
    vi.advanceTimersByTime(300);

    expect(openSpy).toHaveBeenCalledWith("", "_blank");
    expect(printWindow.document.write).toHaveBeenCalled();
    expect(printWindow.document.write.mock.calls[0][0]).toContain(
      "La Pépinière Pédagogique : Faire grandir demain",
    );
    expect(printWindow.print).toHaveBeenCalled();
    expect(printWindow.close).toHaveBeenCalled();
  });
});
