defmodule TimeTracker.GuardianPipeline do
  use Guardian.Plug.Pipeline,
    otp_app: :time_tracker,
     module: TimeTracker.Guardian,
    error_handler: TimeTracker.GuardianErrorHandler

  plug Guardian.Plug.VerifyHeader
  plug Guardian.Plug.VerifySession
  plug Guardian.Plug.EnsureAuthenticated
  plug Guardian.Plug.LoadResource
end
