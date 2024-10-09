defmodule TimeTracker.ClockContextFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `TimeTracker.ClockContext` context.
  """

  @doc """
  Generate a clock.
  """
  def clock_fixture(attrs \\ %{}) do
    {:ok, clock} =
      attrs
      |> Enum.into(%{
        status: true,
        time: ~U[2024-10-06 14:18:00Z]
      })
      |> TimeTracker.ClockContext.create_clock()

    clock
  end
end
