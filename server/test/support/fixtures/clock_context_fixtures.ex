defmodule TimeTracker.ClockContextFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `TimeTracker.ClockContext` context.
  """

  @doc """
  Generate a clock.
  """
  def clock_fixture(attrs \\ %{}) do
    default_attrs = %{
      "status" => true,
      "time" => ~U[2024-10-06 14:18:00Z]
    }

    merged_attrs = Enum.into(attrs, default_attrs)

    {:ok, clock} = TimeTracker.ClockContext.create_clock(merged_attrs)
    clock
  end

end
