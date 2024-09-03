use eframe::egui;
use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::spawn_local;

#[cfg_attr(target_arch = "wasm32", wasm_bindgen)]
pub struct Counter {
    value: i32,
}

impl Counter {
    pub fn new() -> Self {
        Self { value: 0 }
    }
}

impl eframe::App for Counter {
    fn update(&mut self, ctx: &egui::Context, _frame: &mut eframe::Frame) {
        ctx.set_visuals(egui::Visuals::dark());

        let desired_size = egui::vec2(300.0, 200.0);

        egui::CentralPanel::default().show(ctx, |ui| {
            ui.set_max_size(desired_size);
            ui.set_min_size(desired_size);

            ui.vertical_centered(|ui| {
                ui.add_space(20.0);

                ui.heading(egui::RichText::new(format!("{}", self.value)).size(72.0));

                ui.add_space(20.0);

                ui.label("Click anywhere to increment");
            });
        });

        if ctx.input(|i| i.pointer.primary_clicked()) {
            self.value += 1;
            println!("Counter incremented: {}", self.value);
        }
    }
}

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen]
pub fn start(canvas_id: &str) -> Result<(), eframe::wasm_bindgen::JsValue> {
    let web_options = eframe::WebOptions {
        follow_system_theme: false,
        default_theme: eframe::Theme::Dark,
        ..Default::default()
    };
    
    let canvas_id = canvas_id.to_owned();

    spawn_local(async move {
        eframe::WebRunner::new()
            .start(
                &canvas_id,
                web_options,
                Box::new(|cc| {
                    cc.egui_ctx.set_visuals(egui::Visuals::dark());
                    Box::new(Counter::new())
                }),
            )
            .await
            .expect("Failed to start eframe");
    });

    Ok(())
}