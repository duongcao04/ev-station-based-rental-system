import { Container } from "inversify";
import "reflect-metadata";

import { NotificationService } from "../services/notification.service";
import { TYPES } from "../types/global";

const container = new Container();

// --- Auto-binding in action ---
// You ONLY bind your services.
// The controllers (like NotificationController) are bound automatically.
container.bind<NotificationService>(TYPES.NotificationService).to(NotificationService);

export { container };
