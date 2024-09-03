use counter::Counter;
use eframe::egui;

fn main() -> Result<(), eframe::Error> {
    let options = eframe::NativeOptions {
        initial_window_size: Some(egui::vec2(300.0, 200.0)),
        decorated: false,
        ..Default::default()
    };
    eframe::run_native(
        "Counter",
        options,
        Box::new(|_cc| Box::new(Counter::new())),
    )
}